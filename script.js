String.prototype.replaceAllCus = function(strReplace, strWith) {
    // See http://stackoverflow.com/a/3561711/556609
    var esc = strReplace.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    var reg = new RegExp(esc, 'ig');
    return this.replace(reg, strWith);
};

var headers = {
  "accept": "application/json, text/plain, */*",
  "authorization": "Bearer wi5fyVvaelI3TjaXun5fv5nuIXW3L6elebPkLElO",
  "content-type": "application/json;charset=UTF-8",
  "x-requested-with": "XMLHttpRequest",
  "x-udemy-authorization": "Bearer wi5fyVvaelI3TjaXun5fv5nuIXW3L6elebPkLElO"
};
var isInCoursePage = /\/course\/\d+/.test(location.href);
if(isInCoursePage){
  fetch('https://www.udemy.com/api-2.0/users/me/taught-courses/?page=1&page_size=100&ordering=-created&skip_caching=true&fields[course]=title', {
    "headers": headers
  }).then(resp => resp.json())
  .then(resp => {
    var $button = $(`
    <form>
      <input id='oldKeyword'  type='text' placeholder='Input Old Key Word' />
      <input id='newKeyword'  type='text' placeholder='Input New Key Word' />
      <label for='targetCourse'>Choose Course: </label>
      <select id='targetCourse' name='targetCourse'>
        ${resp.results.map(course => '<option value="' + course.id + '">' + course.title + '</option>').join('')}
      </select>
      <label for='isCreateTestTemplate'>Create Test Template </label>
      <input id='isCreateTestTemplate' type='checkbox'/>
    </form>
    <button id='startBtn'>Start</button>
    `);
    setTimeout(function() {
      $('.full-page-takeover-header--header--yZv70').after($button);
    }, 1000);
  });
}
else{
  fetch('https://www.udemy.com/api-2.0/users/me/taught-courses/?page=1&page_size=100&ordering=-created&skip_caching=true&fields[course]=title', {
    "headers": headers
  }).then(resp => resp.json())
  .then(resp => {
    var $button = $(`
    <form>
      <input id='newKeyword'  type='text' placeholder='Input New Key Word' />
      <label for='targetCourse'>Choose Course: </label>
      <select id='targetCourse' name='targetCourse' multiple>
        ${resp.results.map(course => '<option value="' + course.id + '">' + course.title + '</option>').join('')}
      </select>
    </form>
    <button id='startBtn'>Start</button>
    `);
    setTimeout(function() {
      $('.courses--header--38vYX').after($button);
    }, 1000);
  });
}
const startBtnClick = () => {
  var targetCourse = $('#targetCourse').val(),
    oldKeyword = $('#oldKeyword').val(),
    newKeyword = $('#newKeyword').val(),
    isCreateTestTemplate = $('#isCreateTestTemplate').val();
  var courseId = window.location.href.match(/(\d)+/)[0];
  var fetchCourseInfo = fetch(`https://www.udemy.com/api-2.0/courses/${targetCourse}/?fields[course]=base_price_detail,requirements_data,what_you_will_learn_data,who_should_attend_data,title,headline,description,locale,instructional_level_id,primary_category,primary_subcategory,all_course_has_labels,image_750x422,promo_asset,intended_category,category_locked,label_locked,category_applicable,label_applicable,min_summary_words,landing_preview_as_guest_url,&fields[course_label]=@min,versions`, {
    "headers": headers  
  });
  var fetchMessage = fetch(`https://www.udemy.com/api-2.0/courses/${targetCourse}/course-messages/`, {
    "headers": headers
  });
  Promise.all([fetchCourseInfo, fetchMessage])
  .then(data => Promise.all([data[0].json(), data[1].json()]))
  .then(data => {
      console.log(data);
      var test = {};
      for(var i=0; i < data[0]['requirements_data'].items.length; i++) {
       data[0]['requirements_data'].items[i] = data[0]['requirements_data'].items[i].replaceAllCus(oldKeyword, newKeyword);
      }
      test['requirements_data'] = data[0]['requirements_data'];
      for(var i=0; i < data[0]['what_you_will_learn_data'].items.length; i++) {
       data[0]['what_you_will_learn_data'].items[i] = data[0]['what_you_will_learn_data'].items[i].replaceAllCus(oldKeyword, newKeyword);
      }
      test['what_you_will_learn_data'] = data[0]['what_you_will_learn_data'];
      for(var i=0; i < data[0]['who_should_attend_data'].items.length; i++) {
       data[0]['who_should_attend_data'].items[i] = data[0]['who_should_attend_data'].items[i].replaceAllCus(oldKeyword, newKeyword);
      }
      test['who_should_attend_data'] = data[0]['who_should_attend_data'];
      test['category_id'] = data[0]['primary_category'].id;
      test['description'] = data[0]['description'].replaceAllCus(oldKeyword, newKeyword);
      test['headline'] = data[0]['headline'].replaceAllCus(oldKeyword, newKeyword);
      test['instructional_level_id'] = 0;
      test['locale'] = data[0]['locale'].locale;
      test['subcategory_id'] = data[0]['primary_subcategory'].id;
      test['title'] = data[0]['title'].replaceAllCus(oldKeyword, newKeyword);
      test['price_money'] = {
        amount: data[0]['base_price_detail'].amount,
        currency: data[0]['base_price_detail'].currency
      };
      
      
      var welcome = {
        content: data[1].results[1].content,
        errors_only: true,
        message_type: "welcome"
      };
      var complete = {
        content: data[1].results[0].content,
        errors_only: true,
        message_type: "complete"
      };
      var message = [welcome, complete];
      
  var quizz = {
    description: "<p>Since there are too many MCQ and I can not add an explanation for each of them. So, If you do have questions about it, there are 3 ways to reach me:</p><p>1. Post your question to the course discussion area</p><p>2. Message me with your question (include the course name and lecture number).</p><p>3. Fill this question form (Your email address is not required to fill out the form, but if you want me to reply to you I will need it)</p><p>https://forms.gle/KhQjq6otNYYcmpPt5</p><p><br></p><p>PS: Don't forget to check out my website to get my course for <strong>FREE</strong></p><p>thecrackingcodinginterview.com</p>",
    duration: 2400,
    is_randomized: false,
    pass_percent: 70,
    title: "React MCQ Quizz 1",
    type: "practice-test"
  };
  
  var updateCourseInfo = fetch(`https://www.udemy.com/api-2.0/courses/${courseId}/`, {
    "headers": headers,
    "body": JSON.stringify(test),
    "method": "PATCH",
  });
  var updateCourseMessage = fetch(`https://www.udemy.com/api-2.0/courses/${courseId}/course-messages/`, {
    "headers": headers,
    "body": JSON.stringify(message),
    "method": "POST",
  });
  var createNewQuizz = fetch(`https://www.udemy.com/api-2.0/courses/${courseId}/quizzes/?fields[quiz]=description,duration,title,type,is_published,object_index,pass_percent,is_draft,requires_draft,is_randomized,num_assessments`, {
    "headers": headers,
    "body": JSON.stringify(quizz),
    "method": "POST",
  });
      
  Promise.all([updateCourseInfo, updateCourseMessage])
  .then(() => location.reload());
  });
}
$(document).on('click', '#startBtn', startBtnClick);  

