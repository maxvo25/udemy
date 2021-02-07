String.prototype.replaceAllCus = function(strReplace, strWith) {
    // See http://stackoverflow.com/a/3561711/556609
    var esc = strReplace.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    var reg = new RegExp(esc, 'ig');
    return this.replace(reg, strWith);
};

  var firebaseConfig = {
    apiKey: "AIzaSyBcySsX7lODvhK8Z3C4mtzBMdxmVi5tq_0",
    authDomain: "udemy-7c82a.firebaseapp.com",
    databaseURL: "https://udemy-7c82a-default-rtdb.firebaseio.com",
    projectId: "udemy-7c82a",
    storageBucket: "udemy-7c82a.appspot.com",
    messagingSenderId: "606224019623",
    appId: "1:606224019623:web:d12b41b4b2c0dec05c2b82",
    measurementId: "G-R8WP4KJ4JM"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
var rootRef = firebase.database().ref();
var root = {};
rootRef.once('value', (snapshot) => {
  root = snapshot.val();
var $button = $(`
    <form>
      <label for='targetDatabase'>Choose Database: </label>
      <select id='targetDatabase' name='targetDatabase' multiple>
         ${Object.keys(root).map(datab => '<option value="' + datab + '">' + datab + '</option>').join('')}
      </select>
      <label for='targetQuizz'>Choose Quizz: </label>
      <select id='targetQuizz' name='targetQuizz' multiple>
         ${resp[1].results.map(quizz => '<option value="' + quizz.id + '">' + quizz.title + '</option>').join('')}
      </select>
      
    </form>
<button id='updateQuesBtn'>Update Questions</button>
    `);
                $('#updateQuesBtn').after($button);
        });
});

var headers = {
    "accept": "application/json, text/plain, */*",
    "authorization": "Bearer wi5fyVvaelI3TjaXun5fv5nuIXW3L6elebPkLElO",
    "content-type": "application/json;charset=UTF-8",
    "x-requested-with": "XMLHttpRequest",
    "x-udemy-authorization": "Bearer wi5fyVvaelI3TjaXun5fv5nuIXW3L6elebPkLElO"
};
var isInCoursePage = /\/course\/\d+/.test(location.href);
if (isInCoursePage) {
    var getCurriculum = fetch('https://www.udemy.com/api-2.0/courses/3584966/instructor-curriculum-items/?page_size=1400&fields[chapter]=title,description,object_index&fields[lecture]=asset,title,is_published,description,is_downloadable,is_free,object_index,supplementary_assets&fields[quiz]=description,duration,title,type,is_published,object_index,pass_percent,is_draft,requires_draft,is_randomized,num_assessments&fields[practice]=title,is_published,object_index&fields[asset]=created,asset_type,content_summary,time_estimation,status,source_url,thumbnail_url,title,processing_errors,delayed_asset_message,body', {
            "headers": headers
        });
    var getAuthor = fetch('https://www.udemy.com/api-2.0/users/me/taught-courses/?page=1&page_size=100&ordering=-created&skip_caching=true&fields[course]=title', {
            "headers": headers
        });
    Promise.all([getAuthor, getCurriculum]).then(resp => Promise.all([resp[0].json(), resp[1].json()]))
        .then((resp) => {
        debugger;
            var $button = $(`
    <form>
      <input id='oldKeyword'  type='text' placeholder='Input Old Key Word' />
      <input id='newKeyword'  type='text' placeholder='Input New Key Word' />
      <label for='targetCourse'>Choose Course: </label>
      <select id='targetCourse' name='targetCourse'>
        ${resp[0].results.map(course => '<option value="' + course.id + '">' + course.title + '</option>').join('')}
      </select>
      <label for='isCreateTestTemplate'>Create Test Template </label>
      <input id='isCreateTestTemplate' type='checkbox'/>
    </form>
    <button id='startBtn'>Start Clone</button>
    `);
            setTimeout(function() {
                $('.full-page-takeover-header--header--yZv70').after($button);
            }, 1000);
        });
} else {
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
        isCreateTestTemplate = $('#isCreateTestTemplate').is(':checked');
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
            var test = {};
            for (var i = 0; i < data[0]['requirements_data'].items.length; i++) {
                data[0]['requirements_data'].items[i] = data[0]['requirements_data'].items[i].replaceAllCus(oldKeyword, newKeyword);
            }
            test['requirements_data'] = data[0]['requirements_data'];
            for (var i = 0; i < data[0]['what_you_will_learn_data'].items.length; i++) {
                data[0]['what_you_will_learn_data'].items[i] = data[0]['what_you_will_learn_data'].items[i].replaceAllCus(oldKeyword, newKeyword);
            }
            test['what_you_will_learn_data'] = data[0]['what_you_will_learn_data'];
            for (var i = 0; i < data[0]['who_should_attend_data'].items.length; i++) {
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
                description: `<p>Since there are too many MCQ and I can not add an explanation for each of them. So, If you do have questions about it, there are 3 ways to reach me:</p><p>1. Post your question to the course discussion area</p><p>2. Message me with your question (include the course name and lecture number).</p><p>3. Fill this question form (Your email address is not required to fill out the form, but if you want me to reply to you I will need it)</p><p>https://forms.gle/KhQjq6otNYYcmpPt5</p><p><br></p><p>PS: Don't forget to check out my website to get my course for <strong>FREE</strong></p><p>TheCrackingCodingInterview.com</p>`,
                duration: 2400,
                is_randomized: false,
                pass_percent: 70,
                type: "practice-test"
            };
            var quizzBonus = {
                description: "<p>Please don’t forget to post a review, your review is very important to me. please take 30 seconds to post your rating and write a few words. Maybe you let me know if my efforts to upgrade the course were justified. I will truly appreciate it. </p>",
                duration: 2400,
                is_randomized: false,
                pass_percent: 70,
                title: "Get Your BONUS HERE (visit TheCrackingCodingInterview.com to have more Detail)",
                type: "practice-test"
            };
            var quizzBonusQues = {
                "assessment_type": "multi-select",
                "question": "<p><strong>Congratulations for making it to the end!</strong></p><p>Since you're here, you're serious about learning. I would like to offer you the option to <strong>choose any of my courses for only $12.99</strong>.</p><p><br></p><p>Go to my website to know more about other courses and get the CHEAPEST&nbsp;PRICE</p><pre class=\"prettyprint linenums\">thecrackingcodinginterview.com</pre><p>Or use the coupon code below to get the <strong>$12.99</strong> price on checkout.</p><pre class=\"prettyprint linenums\">CODING4INTERVIEW1</pre><p><br></p><p><strong>How to access the SPECIAL&nbsp;BONUS</strong></p><p>Resource URL: https://thecrackingcodinginterview.com/thanks-you-angular/</p><p><br></p><p>Please don’t forget to post reviews, your review is very important to me. please take 30 seconds to post your rating and write a few words. maybe you let me know if my efforts to upgrade the course were justified. I will truly appreciate it. </p>",
                "correct_response": "[\"a\",\"b\"]",
                "related_lecture": "",
                "explanation": "",
                "answers": "[\"<p>Go to the link above to view the resources</p>\",\"<p>Check all options to finish this test. Please don't hesitate to contact me if you have any questions</p>\"]",
                "feedbacks": "[\"\",\"\"]",
                "section": "",
                "section_name_map": "[]"
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
            var promises = [updateCourseInfo, updateCourseMessage];
            if (isCreateTestTemplate) {
                var createNewQuizzBonus = fetch(`https://www.udemy.com/api-2.0/courses/${courseId}/quizzes/?fields[quiz]=description,duration,title,type,is_published,object_index,pass_percent,is_draft,requires_draft,is_randomized,num_assessments`, {
                        "headers": headers,
                        "body": JSON.stringify(quizzBonus),
                        "method": "POST",
                    }).then(resp => resp.json())
                    .then(resp => {
                        var createNewQuizzQues = fetch(`https://www.udemy.com/api-2.0/quizzes/${resp.id}/assessments/?draft=false&fields[assessment]=assessment_type,prompt,correct_response,section`, {
                            "headers": headers,
                            "body": JSON.stringify(quizzBonusQues),
                            "method": "POST",
                        });
                        return createNewQuizzQues;
                    });
                createNewQuizzBonus.then(() => {
                    var subpromises = [];
                    for (var i = 4; i >= 0; i--) {
                        quizz.title = `${newKeyword} MCQ Quizz`;
                        var createNewQuizz = fetch(`https://www.udemy.com/api-2.0/courses/${courseId}/quizzes/?fields[quiz]=description,duration,title,type,is_published,object_index,pass_percent,is_draft,requires_draft,is_randomized,num_assessments`, {
                            "headers": headers,
                            "body": JSON.stringify(quizz),
                            "method": "POST",
                        });
                        subpromises.push(createNewQuizz);
                    }
                    return Promise.all(subpromises);
                });
                promises.push(createNewQuizzBonus);
            }
            Promise.all(promises)
                .then(() => location.reload());
        });
};
const updateQuesBtn = () => {
    debugger;
    var targetDatabase = $('#targetDatabase').val(),
        targetQuizz = $('#targetQuizz').val();
    for(var i=0; i<targetQuizz.length; i++){
        var step = Math.round(root[targetDatabase] / targetQuizz.length);
        for(var j=0; j<step; j++){
fetch("https://www.udemy.com/api-2.0/quizzes/5145776/assessments/?draft=false&fields[assessment]=assessment_type,prompt,correct_response,section", {
      "headers": {
        "accept": "application/json, text/plain, */*",
        "accept-language": "en-US,en;q=0.9,vi-VN;q=0.8,vi;q=0.7,fr-FR;q=0.6,fr;q=0.5,zh-TW;q=0.4,zh;q=0.3",
        "authorization": "Bearer wi5fyVvaelI3TjaXun5fv5nuIXW3L6elebPkLElO",
        "cache-control": "no-cache",
        "content-type": "application/json;charset=UTF-8",
        "pragma": "no-cache",
        "sec-ch-ua": "\"Chromium\";v=\"88\", \"Google Chrome\";v=\"88\", \";Not A Brand\";v=\"99\"",
        "sec-ch-ua-mobile": "?0",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "XMLHttpRequest",
        "x-udemy-authorization": "Bearer wi5fyVvaelI3TjaXun5fv5nuIXW3L6elebPkLElO"
      },
      "referrer": "https://www.udemy.com/instructor/course/3584966/manage/practice-tests/",
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body": JSON.stringify(childData[i]),
      "method": "POST",
      "mode": "cors",
      "credentials": "include"
    });
        }
    }
}
$(document).on('click', '#startBtn', startBtnClick);
$(document).on('click', '#updateQuesBtn', updateQuesBtn);
