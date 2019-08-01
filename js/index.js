$(document).ready(function () {
  var token = sessionStorage.getItem("token");
  if (token == null) {
    window.location.href = "js/pages/page-login.html";
  }

  $('#logout').click(() => {
    sessionStorage.clear()
    window.location.href = "js/pages/page-login.html"
  });

  const url = "https://ccs.cyrix.my/CCS-API/";

  var role = sessionStorage.getItem("role");

  if (role == "admin") {
    $("ul[id='userRole']").empty();
    $("ul[id='userRole']").append(
      "<li><a href='#user-admin'>Admin</a></li><li><a href='#user-supervisor'>Supervisor</a></li><li><a href='#user-operator'>Operator</a></li>"
    );
  } else if (role == "supervisor") {
    $("ul[id='userRole']").empty();
    $("ul[id='userRole']").append(
      "<li><a href='#user-operator'>Operator</a></li>"
    );
  } else {
    $("li[id='users']").empty();
    $("ul[id='main-menu']").children().empty();
    $("body.theme-blue").addClass("menu-icon");
  }

  async function home() {
    $('#root').fadeOut(100)
    if (role == "operator") {
      const res = await fetch(`${url}surveys/region`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${sessionStorage.getItem("token")}`
        }
      });
      const surveys = await res.json();
      var size = Object.keys(surveys).length;
      var random = Math.floor((Math.random() * Number(size) - 1) + 1)
      var survey = surveys[random];

      if (!survey) {
        survey = {
          "available": 0,
          "region_name": sessionStorage.getItem("region"),
          "name": "hantu"
        }
      }

      var html = Template.templates.homeOperator({
        survey,
        surveys,
        url
      });
      $("#root")
        .html(html)
        .fadeIn(1000);
    } else {
      try {
        const res = await fetch(`${url}profiles`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${sessionStorage.getItem("token")}`
          }
        });

        if (res.status === 401) {
          await Swal.fire('Oouppss...', 'Please re-login', 'error')
          return window.location.href = '/js/pages/page-login.html'
        }

        if (res.status !== 200)
          window.location.reload()

        const profiles = await res.json();

        const totalProfiles = profiles.reduce(
          (acc, profile) => {
            if (profile.role === "operator")
              return {
                ...acc,
                operator: (acc.operator += 1)
              };
            if (profile.role === "supervisor")
              return {
                ...acc,
                supervisor: (acc.supervisor += 1)
              };
            return acc;
          }, {
            operator: 0,
            supervisor: 0
          }
        );

        const surveysRes = await fetch(`${url}surveys`, {
          method: 'get',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `bearer ${sessionStorage.getItem('token')}`
          }
        })

        const surveys = await surveysRes.json()

        // format from 1000 => 1,000
        const totalSurveys = surveys.length

        const formattedTotalSurveys = numeral(totalSurveys).format('0 a')

        const newSurveys = surveys.filter(survey => survey.status === 2)

        const formattedNewSurveysNumber = numeral(newSurveys.length).format('0 a')

        const NoNumber = surveys.filter(({
          phone
        }) => !phone.length)

        const notExistNumber = surveys
          .filter(({
              status_phone
            }) => status_phone ?
            status_phone.find(status => status === 'Tak Wujud') : null
          )
          .filter(s => s)

        const formattedNotExistNumber = numeral(notExistNumber.length).format('0 a')

        const formattedNoNumber = numeral(NoNumber.length).format('0 a')

        const comments = surveys
          .map(({
            comment
          }) => comment ? comment[0] : null)
          .filter(comment => comment)
          .reduce((acc, comment) => {
            const commentIndex = acc.findIndex(({
              category
            }) => category == comment)
            if (commentIndex > -1)
              acc[commentIndex].value++
            return acc
          }, [{
              category: 'lain-lain',
              value: 0
            },
            {
              category: 'info',
              value: 0
            },
            {
              category: 'wakil rakyat',
              value: 0
            },
          ])
          .map((comment, i, arr) => {
            return {
              ...comment,
              percent: (comment.value / arr.length * 100).toFixed(2) + '%'
            }
          })

        const surveyByState = surveys.map(
          survey => {
            const partialState = survey.address.split(',').slice(-1)[0].trim()
            return partialState
              .split(' ')
              .reduce((acc, state) => {
                if (state.match(/[A-Za-z]+/g))
                  return acc += state + ' '
                return acc
              }, '')
          }
        )

        const surveyCount = surveyByState
          .reduce((acc, state) => {
            let stateIndex = acc.findIndex(name => name.state === state)

            if (stateIndex === -1) {
              return [
                ...acc,
                {
                  state: state,
                  value: 1
                }
              ]
            }

            acc[stateIndex].value += 1

            return [...acc]
          }, [])

        const top3 = surveyCount
          .sort((a, b) => a.value > b.value)
          .slice(0, 3)

        var html = Template.templates.home({
          totalProfiles,
          url,
          top3,
          formattedTotalSurveys,
          formattedNoNumber,
          comments,
          formattedNotExistNumber,
          formattedNewSurveysNumber
        });
        $("#root")
          .html(html)
          .fadeIn(1000);
      } catch (err) {
        console.log(err);
      }
    }
  }

  crossroads.addRoute('/upload-sasaran', () => {
    $('#root').fadeOut(100)
    var html = Template.templates.uploadSasaran({
      url
    });
    $("#root")
      .html(html)
      .fadeIn(1000);
  })

  const getRole = async arg => {
    $('#root').fadeOut(100)
    const regionRes = await fetch(`${url}regions`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
      },
      method: 'get'
    });

    const regions = await regionRes.json();

    const quesRes = await fetch(`${url}/questions`, {
      method: "get",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
        Authorization: `bearer ${sessionStorage.getItem("token")}`
      }
    });

    const ques = await quesRes.json();

    try {
      if (sessionStorage.role == "supervisor") {
        newurl = `${url}profiles/role/operator`;
      } else {
        newurl = `${url}profiles/role/${arg}`;
      }

      const res = await fetch(newurl, {
        method: "get",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
          Authorization: `bearer ${sessionStorage.getItem("token")}`
        }
      });

      const oper = await res.json();

      if (
        sessionStorage.role == "supervisor" ||
        (sessionStorage.role == "admin" && arg == "operator")
      ) {
        var html = Template.templates.userOperator({
          regions,
          ques,
          oper,
          url
        });
        $("#root")
          .html(html)
          .fadeIn(1000);
      } else if (sessionStorage.role == "admin" && arg == "admin") {
        var html = Template.templates.userAdmin({
          oper,
          url,
          regions,
          ques
        });
        $("#root")
          .html(html)
          .fadeIn(1000);
      } else if (sessionStorage.role == "admin" && arg == "supervisor") {
        var html = Template.templates.userSupervisor({
          oper,
          url,
          regions,
          ques
        });
        $("#root")
          .html(html)
          .fadeIn(1000);
      }
    } catch (err) {
      console.log(err);
    }
  };

  crossroads.addRoute("/", home);
  crossroads.addRoute("/home", home);
  crossroads.addRoute("/user-supervisor", () => getRole("supervisor"));
  crossroads.addRoute("/user-operator", () => getRole("operator"));
  crossroads.addRoute("/user-admin", () => getRole("admin"));

  crossroads.addRoute("/record-statistics", function () {
    $('#root').fadeOut(100)
    var html = Template.templates.recordStatistics({
      url
    });
    $("#root")
      .html(html)
      .fadeIn(1000);
  });

  crossroads.addRoute("/record-region", function () {
    $('#root').fadeOut(100)
    var html = Template.templates.recordRegion({
      url
    });
    $("#root")
      .html(html)
      .fadeIn(1000);
  });

  async function survey() {
    $('#root').fadeOut(100)
    var survey = JSON.parse(sessionStorage.getItem("targetedSurvey"));
    var phone = JSON.parse(sessionStorage.getItem("phone"));
    var profile = JSON.parse(sessionStorage.getItem("profile"));

    const quesRes = await fetch(`${url}/question/set_id`, {
      method: "get",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
        Authorization: `bearer ${sessionStorage.getItem("token")}`
      }
    });

    const ques = await quesRes.json();
    var soalan = JSON.parse(ques.questions);
    var gender = survey[0].gender;

    if (gender === "Male") {
      gender = true;
    } else {
      gender = false;
    }
    var html = Template.templates.survey({
      survey,
      profile,
      gender,
      phone,
      url,
      ques,
      soalan
    });
    $("#root")
      .html(html)
      .fadeIn(1000);
  }

  crossroads.addRoute("/survey", survey);

  async function question() {
    $('#root').fadeOut(100)
    try {
      const res = await fetch(`${url}/questions`, {
        method: "get",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
          Authorization: `bearer ${sessionStorage.getItem("token")}`
        }
      });

      const ques = await res.json();
      sessionStorage.setItem("question", JSON.stringify(ques));
      var html = Template.templates.questionSet({
        ques,
        url
      });
      $("#root")
        .html(html)
        .fadeIn(100);
    } catch (err) {
      console.log(err);
    }
  }

  function newQuestion() {
    $('#root').fadeOut(100)
    var ques = JSON.parse(sessionStorage.getItem("question"));
    var id = Object.keys(ques).length;
    id = id + 1;
    var html = Template.templates.newQuestion({
      id,
      url
    });
    $("#root")
      .html(html)
      .fadeIn(1000);
  }

  async function result() {
    $('#root').fadeOut(100)
    const res = await fetch(`${url}regions`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${sessionStorage.getItem("token")}`
      }
    });
    const regions = await res.json()
    var html = Template.templates.result({
      regions,
      url
    })
    $("#root")
      .html(html)
      .fadeIn(1000);
  }

  async function surveyRecord() {
    $('#root').fadeOut(100)
    var region_id = sessionStorage.getItem("region_id")
    const res = await fetch(`${url}surveys/statistics/${region_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${sessionStorage.getItem("token")}`
      }
    });
    const regionRecord = await res.json()
    var status = 0
    const successSurveys = regionRecord.filter(region => status === region.status);
    var html = Template.templates.surveyRecord({
      successSurveys,
      url
    })
    $("#root")
      .html(html)
      .fadeIn(1000);
  }

  crossroads.addRoute("/question-set", question);
  crossroads.addRoute("/new-question", newQuestion);
  crossroads.addRoute("/result", result);
  crossroads.addRoute("/survey-record", surveyRecord);

  // Add the Flot version string to the footer
  $("#footer").prepend("Flot " + $.plot.version + " &ndash; ");
  // Visitors Statistics ============= end

  function parseHash(newHash, oldHash) {
    crossroads.parse(newHash);
  }
  hasher.initialized.add(parseHash); //parse initial hash
  hasher.changed.add(parseHash); //parse hash changes
  hasher.init(); //start listening for history change
});