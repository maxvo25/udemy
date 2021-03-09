const targetCourse = '3855266';

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

String.prototype.replaceAllCus = function (strReplace, strWith) {
  // See http://stackoverflow.com/a/3561711/556609
  const esc = strReplace.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  const reg = new RegExp(esc, 'ig');
  return this.replace(reg, strWith);
};

// const firebaseConfig = {
//   apiKey: 'AIzaSyBcySsX7lODvhK8Z3C4mtzBMdxmVi5tq_0',
//   authDomain: 'udemy-7c82a.firebaseapp.com',
//   databaseURL: 'https://udemy-7c82a-default-rtdb.firebaseio.com',
//   projectId: 'udemy-7c82a',
//   storageBucket: 'udemy-7c82a.appspot.com',
//   messagingSenderId: '606224019623',
//   appId: '1:606224019623:web:d12b41b4b2c0dec05c2b82',
//   measurementId: 'G-R8WP4KJ4JM',
// };

    var firebaseConfig = {
      apiKey: "AIzaSyAr1jh_E4Jx-qnqJaAcXahCKBlat56LAmU",
      authDomain: "udemy-1f563.firebaseapp.com",
      projectId: "udemy-1f563",
      storageBucket: "udemy-1f563.appspot.com",
      messagingSenderId: "1093194210543",
      appId: "1:1093194210543:web:078e1c2c8b41788cdf8f1a",
      measurementId: "G-D77075J376"
    };

  // Initialize Firebase
firebase.initializeApp(firebaseConfig);
const rootRef = firebase.database().ref();
var courseId = -1;
let root = {};
const token = getCookie('access_token');

var headers = {
  accept: 'application/json, text/plain, */*',
  authorization: `Bearer ${token}`,
  'content-type': 'application/json;charset=UTF-8',
  'x-requested-with': 'XMLHttpRequest',
  'x-udemy-authorization': `Bearer ${token}`,
};

firebase.database().ref('New Udemy Course').on('value', (snapshot) => {
  var newCourse = snapshot.val();
  listenNewCourse(newCourse.keywords, newCourse.dbName);
});

rootRef.on('value', (snapshot) => {
  root = snapshot.val();
});

const isInCoursePage = /\/course\/\d+/.test(location.href);
setTimeout(() => {
  $('.curriculum--sub-header--23ncD').prepend($(`<button id="cloneCourse">Clone This Course</button>`));
}, 2000);
if (isInCoursePage) {
  courseId = window.location.href.match(/(\d)+/)[0];
  showUpdateQuestions();
  const getAuthor = fetch('https://www.udemy.com/api-2.0/users/me/taught-courses/?page=1&page_size=100&ordering=-created&skip_caching=true&fields[course]=title', {
    headers,
  });
  Promise.all([getAuthor]).then((resp) => Promise.all([resp[0].json()]))
    .then((resp) => {
      const $button = $(`
    <form>
      <input id='oldKeyword'  type='text' placeholder='Input Old Key Word' />
      <input id='newKeyword'  type='text' placeholder='Input New Key Word' />
      <label for='targetCourse'>Choose Course: </label>
      <select id='targetCourse' name='targetCourse'>
        ${resp[0].results.map((course) => `<option value="${course.id}">${course.title}</option>`).join('')}
      </select>
      <label for='isCreateTestTemplate'>Create Test Template </label>
      <input id='isCreateTestTemplate' type='checkbox'/>
    </form>
    <button id='startBtn'>Start Clone</button>
    `);
      setTimeout(() => {
        $('.full-page-takeover-header--header--yZv70').after($button);
      }, 1000);
    });
} else {
  rootRef.once('value', (snapshot) => {
  fetch('https://www.udemy.com/api-2.0/users/me/taught-courses/?page=1&page_size=100&ordering=-created&skip_caching=true&fields[course]=title', {
    headers,
  }).then((resp) => resp.json())
    .then((resp) => {
      const $button = $(`
    <form>
      <input id='oldKeyword'  type='text' placeholder='Input Old Key Word' />
      <label for='targetCourse'>Choose Course: </label>
      <select id='targetCourse' name='targetCourse'>
        ${resp.results.map((course) => `<option value="${course.id}">${course.title}</option>`).join('')}
      </select>
      <label for='targetDatabase'>Choose Database: </label>
      <select id='targetDatabase' name='targetDatabase'>
         ${Object.keys(root).map((datab) => `<option value="${datab}">${datab + ' - ' + root[datab].length + ' Questions'}</option>`).join('')}
      </select>
    </form>
    <button id='listenNewCourse'>Listen For New Course</button>
    `);
    $(document).ready(function(){
    $('.courses--header--38vYX').after($button);
    });
    });
    });
}
const startBtnClick = () => {
  const targetCourse = $('#targetCourse').val();
  const oldKeyword = $('#oldKeyword').val();
  const newKeyword = $('#newKeyword').val();
  const isCreateTestTemplate = $('#isCreateTestTemplate').is(':checked');
  const fetchCourseInfo = fetch(`https://www.udemy.com/api-2.0/courses/${targetCourse}/?fields[course]=base_price_detail,requirements_data,what_you_will_learn_data,who_should_attend_data,title,headline,description,locale,instructional_level_id,primary_category,primary_subcategory,all_course_has_labels,image_750x422,promo_asset,intended_category,category_locked,label_locked,category_applicable,label_applicable,min_summary_words,landing_preview_as_guest_url,&fields[course_label]=@min,versions`, {
    headers,
  });
  const fetchMessage = fetch(`https://www.udemy.com/api-2.0/courses/${targetCourse}/course-messages/`, {
    headers,
  });
  Promise.all([fetchCourseInfo, fetchMessage])
    .then((data) => Promise.all([data[0].json(), data[1].json()]))
    .then((data) => {
      const test = {};
      for (var i = 0; i < data[0].requirements_data.items.length; i++) {
        data[0].requirements_data.items[i] = data[0].requirements_data.items[i].replaceAllCus(oldKeyword, newKeyword);
      }
      test.requirements_data = data[0].requirements_data;
      for (var i = 0; i < data[0].what_you_will_learn_data.items.length; i++) {
        data[0].what_you_will_learn_data.items[i] = data[0].what_you_will_learn_data.items[i].replaceAllCus(oldKeyword, newKeyword);
      }
      test.what_you_will_learn_data = data[0].what_you_will_learn_data;
      for (var i = 0; i < data[0].who_should_attend_data.items.length; i++) {
        data[0].who_should_attend_data.items[i] = data[0].who_should_attend_data.items[i].replaceAllCus(oldKeyword, newKeyword);
      }
      test.who_should_attend_data = data[0].who_should_attend_data;
      test.category_id = data[0].primary_category.id;
      test.description = data[0].description.replaceAllCus(oldKeyword, newKeyword);
      test.headline = data[0].headline.replaceAllCus(oldKeyword, newKeyword).substring(0,120);
      test.instructional_level_id = 0;
      test.locale = data[0].locale.locale;
      test.subcategory_id = data[0].primary_subcategory.id;
      test.title = data[0].title.replaceAllCus(oldKeyword, newKeyword).substring(0,60);
      test.price_money = {
        amount: data[0].base_price_detail.amount,
        currency: data[0].base_price_detail.currency,
      };


      const welcome = {
        content: data[1].results[1].content,
        errors_only: true,
        message_type: 'welcome',
      };
      const complete = {
        content: data[1].results[0].content,
        errors_only: true,
        message_type: 'complete',
      };
      const message = [welcome, complete];

      const coursePromotion = {
        'code': "CODING4INTERVIEW1",
        'discount_strategy': "long_discount",
        'discount_value': 12.99
      };
      const quizz = {
        description: '<p>Since there are too many MCQ and I can not add an explanation for each of them. So, If you do have questions about it, there are 3 ways to reach me:</p><p>1. Post your question to the course discussion area</p><p>2. Message me with your question (include the course name and lecture number).</p><p>3. Fill this question form (Your email address is not required to fill out the form, but if you want me to reply to you I will need it)</p><p>https://forms.gle/KhQjq6otNYYcmpPt5</p><p><br></p><p>PS: Don\'t forget to check out my website to get my course for <strong>FREE</strong></p><p>TheCrackingCodingInterview.com</p>',
        duration: 2400,
        is_randomized: false,
        pass_percent: 70,
        type: 'practice-test',
      };
      const quizzBonus = {
        description: '<p>Please don’t forget to post a review, your review is very important to me. please take 30 seconds to post your rating and write a few words. Maybe you let me know if my efforts to upgrade the course were justified. I will truly appreciate it. </p>',
        duration: 2400,
        is_randomized: false,
        pass_percent: 70,
        title: 'Get Your BONUS HERE (visit TheCrackingCodingInterview.com to have more Detail)',
        type: 'practice-test',
      };
      const quizzBonusQues = {
        assessment_type: 'multi-select',
        question: "<p><strong>Congratulations for making it to the end!</strong></p><p>Since you're here, you're serious about learning. I would like to offer you the option to <strong>choose any of my courses for only $12.99</strong>.</p><p><br></p><p>Go to my website to know more about other courses and get the CHEAPEST&nbsp;PRICE</p><pre class=\"prettyprint linenums\">thecrackingcodinginterview.com</pre><p>Or use the coupon code below to get the <strong>$12.99</strong> price on checkout.</p><pre class=\"prettyprint linenums\">CODING4INTERVIEW1</pre><p><br></p><p><strong>How to access the SPECIAL&nbsp;BONUS</strong></p><p>Resource URL: https://thecrackingcodinginterview.com/thanks-you-angular/</p><p><br></p><p>Please don’t forget to post reviews, your review is very important to me. please take 30 seconds to post your rating and write a few words. maybe you let me know if my efforts to upgrade the course were justified. I will truly appreciate it. </p>",
        correct_response: '["a","b"]',
        related_lecture: '',
        explanation: '',
        answers: "[\"<p>Go to the link above to view the resources</p>\",\"<p>Check all options to finish this test. Please don't hesitate to contact me if you have any questions</p>\"]",
        feedbacks: '["",""]',
        section: '',
        section_name_map: '[]',
      };

      const updateCourseInfo = fetch(`https://www.udemy.com/api-2.0/courses/${courseId}/`, {
        headers,
        body: JSON.stringify(test),
        method: 'PATCH',
      });
      const updateCourseMessage = fetch(`https://www.udemy.com/api-2.0/courses/${courseId}/course-messages/`, {
        headers,
        body: JSON.stringify(message),
        method: 'POST',
      });
      const updateCoursePromotion = fetch(`https://www.udemy.com/api-2.0/courses/${courseId}/coupons-v2/`, {
        headers,
        body: JSON.stringify(coursePromotion),
        method: 'POST',
      });
      const promises = [updateCourseInfo, updateCourseMessage, updateCoursePromotion];
      if (isCreateTestTemplate) {
        const createNewQuizzBonus = fetch(`https://www.udemy.com/api-2.0/courses/${courseId}/quizzes/?fields[quiz]=description,duration,title,type,is_published,object_index,pass_percent,is_draft,requires_draft,is_randomized,num_assessments`, {
          headers,
          body: JSON.stringify(quizzBonus),
          method: 'POST',
        }).then((resp) => resp.json())
          .then((resp) => {
            const createNewQuizzQues = fetch(`https://www.udemy.com/api-2.0/quizzes/${resp.id}/assessments/?draft=false&fields[assessment]=assessment_type,prompt,correct_response,section`, {
              headers,
              body: JSON.stringify(quizzBonusQues),
              method: 'POST',
            });
            return createNewQuizzQues;
          });
        createNewQuizzBonus.then(() => {
          const subpromises = [];
          for (let i = 4; i >= 0; i--) {
            quizz.title = `${newKeyword} MCQ Quizz`;
            const createNewQuizz = fetch(`https://www.udemy.com/api-2.0/courses/${courseId}/quizzes/?fields[quiz]=description,duration,title,type,is_published,object_index,pass_percent,is_draft,requires_draft,is_randomized,num_assessments`, {
              headers,
              body: JSON.stringify(quizz),
              method: 'POST',
            });
            subpromises.push(createNewQuizz);
          }
          return Promise.all(subpromises);
        });
        promises.push(createNewQuizzBonus);
      }
      Promise.all(promises)
        .then(() => alert('Done!!!'));
    });
};
const updateQuesBtn = () => {
  const targetDatabase = $('#targetDatabase').val();
  const targetQuizz = $('#targetQuizz').val();
  const step = Math.round(root[targetDatabase].length / targetQuizz.length);
  var promises = [];
  for (let i = 0; i < targetQuizz.length; i++) {
    
    var j = i * step;
    var max = (i + 1) * step;
    for (; j < max; j++) {
      var promise = fetch(`https://www.udemy.com/api-2.0/quizzes/${targetQuizz[i]}/assessments/?draft=false&fields[assessment]=assessment_type,prompt,correct_response,section`, {
        headers,
        body: JSON.stringify(root[targetDatabase][j]),
        method: 'POST',
      });
      promises.push(promise);
    }
  }
  Promise.all(promises)
  .then(() => alert('Done!!!'));
};

function listenNewCourse(keyword, targetDatabase){
  var newKeyword = keyword.split('|');
  const max = 750;
  const numQuiz = 5;
  if(root[targetDatabase].length > max)
      root[targetDatabase] = root[targetDatabase].splice(0, max);
  const step = Math.round(root[targetDatabase].length / numQuiz);
  fetch("https://www.udemy.com/api-2.0/courses/", {
    headers,
    body: JSON.stringify({
      is_practice_test_course: true, 
      title: "New Course", 
      intended_category_id: "294"
    }),
    method: 'POST'
})
  .then(resp => resp.json())
  .then(resp => {
    const courseId = resp.id;
  const oldKeyword = ['[short name]', '[certificate name]', '[number question]'];
    newKeyword.push(root[targetDatabase].length);
  const isCreateTestTemplate = true;
  const fetchCourseInfo = fetch(`https://www.udemy.com/api-2.0/courses/${targetCourse}/?fields[course]=base_price_+detail,requirements_data,what_you_will_learn_data,who_should_attend_data,title,headline,description,locale,instructional_level_id,primary_category,primary_subcategory,all_course_has_labels,image_750x422,promo_asset,intended_category,category_locked,label_locked,category_applicable,label_applicable,min_summary_words,landing_preview_as_guest_url,&fields[course_label]=@min,versions`, {
    headers,
  });
  const fetchMessage = fetch(`https://www.udemy.com/api-2.0/courses/${targetCourse}/course-messages/`, {
    headers,
  });
  Promise.all([fetchCourseInfo, fetchMessage])
    .then((data) => Promise.all([data[0].json(), data[1].json()]))
    .then((data) => {
      const test = {};
      for (var i = 0; i < data[0].requirements_data.items.length; i++) {
        data[0].requirements_data.items[i] = data[0].requirements_data.items[i].replaceAll(oldKeyword[0], newKeyword[0]).replaceAll(oldKeyword[1], newKeyword[1]);
      }
      test.requirements_data = data[0].requirements_data;
      for (var i = 0; i < data[0].what_you_will_learn_data.items.length; i++) {
        data[0].what_you_will_learn_data.items[i] = data[0].what_you_will_learn_data.items[i].replaceAll(oldKeyword[0], newKeyword[0]).replaceAll(oldKeyword[1], newKeyword[1]);
      }
      test.what_you_will_learn_data = data[0].what_you_will_learn_data;
      for (var i = 0; i < data[0].who_should_attend_data.items.length; i++) {
        data[0].who_should_attend_data.items[i] = data[0].who_should_attend_data.items[i].replaceAll(oldKeyword[0], newKeyword[0]).replaceAll(oldKeyword[1], newKeyword[1]);
      }
      test.who_should_attend_data = data[0].who_should_attend_data;
      test.category_id = data[0].primary_category.id;
      test.description = data[0].description.replaceAll(oldKeyword[0], newKeyword[0]).replaceAll(oldKeyword[1], newKeyword[1]).replaceAll(oldKeyword[2], newKeyword[2]);
      test.headline = data[0].headline.replaceAll(oldKeyword[0], newKeyword[0]).replaceAll(oldKeyword[1], newKeyword[1]).substring(0,120);
      test.instructional_level_id = 0;
      test.locale = data[0].locale.locale;
      test.subcategory_id = data[0].primary_subcategory.id;
      test.title = data[0].title.replaceAll(oldKeyword[0], newKeyword[0]).replaceAll(oldKeyword[1], newKeyword[1]).substring(0,60);
      test.price_money = {
        amount: (data[0].base_price_detail && data[0].base_price_detail.amount) || '99',
        currency: (data[0].base_price_detail && data[0].base_price_detail.currency) || 'USD',
      };


      const welcome = {
        content: data[1].results[1].content,
        errors_only: true,
        message_type: 'welcome',
      };
      const complete = {
        content: data[1].results[0].content,
        errors_only: true,
        message_type: 'complete',
      };
      const message = [welcome, complete];

      const coursePromotion = {
        'code': "CODING4INTERVIEW1",
        'discount_strategy': "long_discount",
        'discount_value': 12.99
      };
      const quizz = {
        description: '<p>Since there are too many MCQ and I can not add an explanation for each of them. So, If you do have questions about it, there are 3 ways to reach me:</p><p>1. Post your question to the course discussion area</p><p>2. Message me with your question (include the course name and lecture number).</p><p>3. Fill this question form (Your email address is not required to fill out the form, but if you want me to reply to you I will need it)</p><p>https://forms.gle/KhQjq6otNYYcmpPt5</p><p><br></p><p>PS: Don\'t forget to check out my website to get my course for <strong>FREE</strong></p><p>TheCrackingCodingInterview.com</p>',
        is_randomized: true,
        pass_percent: 70,
        type: 'practice-test',
      };
      const quizzBonus = {
        description: '<p>Please don’t forget to post a review, your review is very important to me. please take 30 seconds to post your rating and write a few words. Maybe you let me know if my efforts to upgrade the course were justified. I will truly appreciate it. </p>',
        duration: 2400,
        is_randomized: false,
        pass_percent: 70,
        title: 'Get Your BONUS HERE (visit TheCrackingCodingInterview.com to have more Detail)',
        type: 'practice-test',
      };
      const quizzBonusQues = {
        assessment_type: 'multi-select',
        question: "<p><strong>Congratulations for making it to the end!</strong></p><p>Since you're here, you're serious about learning. I would like to offer you the option to <strong>choose any of my courses for only $12.99</strong>.</p><p><br></p><p>Go to my website to know more about other courses and get the CHEAPEST&nbsp;PRICE</p><pre class=\"prettyprint linenums\">thecrackingcodinginterview.com</pre><p>Or use the coupon code below to get the <strong>$12.99</strong> price on checkout.</p><pre class=\"prettyprint linenums\">CODING4INTERVIEW1</pre><p><br></p><p><strong>How to access the SPECIAL&nbsp;BONUS</strong></p><p>Resource URL: https://thecrackingcodinginterview.com/thankyou</p><p><br></p><p>Please don’t forget to post reviews, your review is very important to me. please take 30 seconds to post your rating and write a few words. maybe you let me know if my efforts to upgrade the course were justified. I will truly appreciate it. </p>",
        correct_response: '["a","b"]',
        related_lecture: '',
        explanation: '',
        answers: "[\"<p>Go to the link above to view the resources</p>\",\"<p>Check all options to finish this test. Please don't hesitate to contact me if you have any questions</p>\"]",
        feedbacks: '["",""]',
        section: '',
        section_name_map: '[]',
      };

      const updateCourseInfo = fetch(`https://www.udemy.com/api-2.0/courses/${courseId}/`, {
        headers,
        body: JSON.stringify(test),
        method: 'PATCH',
      });
      const updateCourseMessage = fetch(`https://www.udemy.com/api-2.0/courses/${courseId}/course-messages/`, {
        headers,
        body: JSON.stringify(message),
        method: 'POST',
      });
      const updateCoursePromotion = fetch(`https://www.udemy.com/api-2.0/courses/${courseId}/coupons-v2/`, {
        headers,
        body: JSON.stringify(coursePromotion),
        method: 'POST',
      });
      const promises = [updateCourseInfo, updateCourseMessage, updateCoursePromotion];
      if (isCreateTestTemplate) {
        const createNewQuizzBonus = fetch(`https://www.udemy.com/api-2.0/courses/${courseId}/quizzes/?fields[quiz]=description,duration,title,type,is_published,object_index,pass_percent,is_draft,requires_draft,is_randomized,num_assessments`, {
          headers,
          body: JSON.stringify(quizzBonus),
          method: 'POST',
        }).then((resp) => resp.json())
          .then((resp) => {
            const createNewQuizzQues = fetch(`https://www.udemy.com/api-2.0/quizzes/${resp.id}/assessments/?draft=false&fields[assessment]=assessment_type,prompt,correct_response,section`, {
              headers,
              body: JSON.stringify(quizzBonusQues),
              method: 'POST',
            });
            return createNewQuizzQues;
          });
        createNewQuizzBonus.then(() => {
          var subpromises = [];
          for (let i = 5; i > 0; i--) {
            quizz.title = `${newKeyword[1]} Practice Test`;
            quizz.duration = step * 60;
            const createNewQuizz = fetch(`https://www.udemy.com/api-2.0/courses/${courseId}/quizzes/?fields[quiz]=description,duration,title,type,is_published,object_index,pass_percent,is_draft,requires_draft,is_randomized,num_assessments`, {
              headers,
              body: JSON.stringify(quizz),
              method: 'POST',
            })
            
            .then(resp => resp.json())
            .then(resp => {
  const targetQuizz = resp.id;
              const questions = root[targetDatabase].splice(0, step);
              for(var i=0; i<questions.length; i++)
      var promise = fetch(`https://www.udemy.com/api-2.0/quizzes/${targetQuizz}/assessments/?draft=false&fields[assessment]=assessment_type,prompt,correct_response,section`, {
        headers,
        body: JSON.stringify(questions[i]),
        method: 'POST',
      });
        })}})}})});
  
}

function showUpdateQuestions(){
rootRef.once('value', (snapshot) => {
  root = snapshot.val();
  const getCurriculum = fetch(`https://www.udemy.com/api-2.0/courses/${courseId}/instructor-curriculum-items/?page_size=1400&fields[chapter]=title,description,object_index&fields[lecture]=asset,title,is_published,description,is_downloadable,is_free,object_index,supplementary_assets&fields[quiz]=description,duration,title,type,is_published,object_index,pass_percent,is_draft,requires_draft,is_randomized,num_assessments&fields[practice]=title,is_published,object_index&fields[asset]=created,asset_type,content_summary,time_estimation,status,source_url,thumbnail_url,title,processing_errors,delayed_asset_message,body`, {
    headers,
  });
  getCurriculum.then(resp => resp.json())
  .then(resp => {
  const $button = $(`
    <form>
      <label for='targetDatabase'>Choose Database: </label>
      <select id='targetDatabase' name='targetDatabase'>
         ${Object.keys(root).map((datab) => `<option value="${datab}">${datab + ' - ' + root[datab].length + ' Questions'}</option>`).join('')}
      </select>
      <label for='targetQuizz'>Choose Quizz: </label>
      <select id='targetQuizz' name='targetQuizz' multiple>
         ${resp.results.map((quizz) => `<option value="${quizz.id}">${quizz.title}</option>`).join('')}
      </select>
      
    </form>
<button id='updateQuesBtn'>Update Questions</button>
    `);
  $('.full-page-takeover-header--header--yZv70').after($button);
  });
});
}

function cloneCourse(){
  var courseId = $(document.body).data('clp-course-id');
  var courseTitle = $('title').text().replace(/[^a-zA-Z ]/g, "");
  var getCourseInformation1 = fetch(`https://www.udemy.com/api-2.0/courses/${courseId}/?fields[course]=base_price_detail,requirements_data,what_you_will_learn_data,who_should_attend_data,title,headline,description,locale,instructional_level_id,primary_category,primary_subcategory,all_course_has_labels,image_750x422,promo_asset,intended_category,category_locked,label_locked,category_applicable,label_applicable,min_summary_words,landing_preview_as_guest_url,&fields[course_label]=@min,versions`, {
    headers,
  });
  var getCourseTestCurr1 = fetch(`https://www.udemy.com/api-2.0/courses/${courseId}/subscriber-curriculum-items/?page_size=1400&fields[lecture]=title,object_index,is_published,sort_order,created,asset,supplementary_assets,is_free&fields[quiz]=title,object_index,is_published,sort_order,type&fields[practice]=title,object_index,is_published,sort_order&fields[chapter]=title,object_index,is_published,sort_order&fields[asset]=title,filename,asset_type,status,time_estimation,is_external&caching_intent=True`, {
    headers,
  });
  Promise.all([getCourseInformation1, getCourseTestCurr1])
  .then(resp => { return Promise.all([resp[0].json(), resp[1].json()]) })
  .then(resp => {
    var versions = [15, 12, 10, 22, 1]
    var promises = resp[1].results.map((c, i) => {
        return fetch(`https://www.udemy.com/api-2.0/quizzes/${c.id}/assessments/?version=${versions[i]}&page_size=250&fields[assessment]=id,assessment_type,prompt,correct_response,section,question_plain,related_lectures`, 
        {
      headers
    	})
    });
    Promise.all(promises).then((resp) => Promise.all(resp.map(p => p.json())))
    .then(resp => {
        var push = resp.reduce((res, e) => {return res.concat(e.results)}, []);
        let json =
            push.map(e => {
                return {
                    "assessment_type": e.assessment_type,
                    "question": e.prompt.question,
                    "correct_response": JSON.stringify(e.correct_response),
                    "related_lecture": "",
                    "explanation": e.prompt.explanation || "",
                    "answers": JSON.stringify(e.prompt.answers),
                    "feedbacks": '["",""]',
                    "section": "",
                    "section_name_map": "[]"
                };
            });
        firebase.database().ref().child(`clone-${courseTitle}`).set(json).then(resp => alert(1));
    });
  });
}
$(document).on('click', '#startBtn', startBtnClick);
$(document).on('click', '#updateQuesBtn', updateQuesBtn);
$(document).on('click', '#cloneCourse', cloneCourse);
$(document).on('click', '#listenNewCourse', listenNewCourse);

