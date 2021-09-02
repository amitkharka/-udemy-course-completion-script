const axios = require('axios');
const { Cookie, Authorization } = require('./authentication.js');

const COURSE_ID = '';

if (!COURSE_ID) {
  console.error('Invalid Course ID');
  return;
}

const COURSE_CONTENT = `https://hclsoftwarelearning.udemy.com/api-2.0/courses/${COURSE_ID}/subscriber-curriculum-items/?page_size=10000&fields[lecture]=title,object_index,is_published,sort_order,created,asset,supplementary_assets,is_free&fields[quiz]=title,object_index,is_published,sort_order,type&fields[practice]=title,object_index,is_published,sort_order&fields[chapter]=title,object_index,is_published,sort_order&fields[asset]=title,filename,asset_type,status,time_estimation,is_external&caching_intent=True`;

const LECTURE_URL = `https://hclsoftwarelearning.udemy.com/api-2.0/users/me/subscribed-courses/${COURSE_ID}/completed-lectures/`;

async function getCourseDetails() {
  const options = {
    method: 'GET',
    url: COURSE_CONTENT,
    headers: {
      Cookie,
      Authorization,
    },
  };
  try {
    const response = await axios(options);
    if (response?.data?.results?.length) {
      startCourse(response.data.results);
    }
  } catch (error) {
    console.error(error);
  }

};


function startCourse(lectures) {
  const promise = [];
  let i = 0;

  lectures.forEach((item) => {
    if (item._class === 'lecture') {
      const options = {
        method: 'POST',
        url: LECTURE_URL,
        headers: {
          Cookie,
          Authorization,
        },
        data: { "lecture_id": item.id, "downloaded": false },
      };
      promise[i] = new Promise((resolve, reject) => {
        axios(options)
          .then((response) => {
            resolve(response.data);
          })
          .catch((error) => {
            // handle error
            console.log(error);
            reject(error);
          });
      });
      i++;
    }
  });

  Promise.all(promise).then(() => {
    console.log('Completed');
  }).catch((error) => {
    console.error(error);
  })
}

getCourseDetails();
