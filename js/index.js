$(document).ready(function () {
  var token = sessionStorage.getItem("token");
  if (token == null) {
    window.location.href = "js/pages/page-login.html";
  }

  $('#logout').click(() => {
    sessionStorage.clear()
    window.location.href = "js/pages/page-login.html"
  });

  Handlebars.registerHelper("date", function (timestamp) {
    return moment(timestamp).format('DD MMMM YYYY')
  });

  Handlebars.registerHelper("json", function (content) {
    return JSON.stringify(content);
  });

  Handlebars.registerHelper("len", function (json) {
    return Object.keys(json).length;
  });

  Handlebars.registerHelper("index", function (index) {
    return index + 1;
  });

  // const url = "https://ccs.cyrix.my/CCS-API/";
  const url = "http://localhost/CCS-API/";

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
    if (role == "operator") {
      var survey = [
        {
          name: "Muhammad Izzad Rasyidi bin Jahan",
          gender: "Male",
          race: "Johorean",
          address: "Felda Ulu Taib Andak, Kulai Johor",
          phone: "0123456789",
          location: "Johor"
        },
        {
          name: "Ahmad Azamuddin bin Hasni",
          gender: "Male",
          race: "Johorean",
          address: "Masai Johor",
          phone: "0123344876",
          location: "Johor"
        },
        {
          name: "Nurul Nazihah binti Jamal",
          gender: "Female",
          race: "Pahangian",
          address: "Kuantan Pahang",
          phone: "0115234532",
          location: "Pahang"
        },
        {
          name: "Ameera Akmalia binti Alias",
          gender: "Female",
          race: "Unknown",
          address: "Puncak Alam, Selangor",
          phone: "0176754281",
          location: "Selangor"
        }
      ]

      var html = Template.templates.homeOperator({ survey, url });
      $("#root")
        .html(html)
        .show();
    } else {
      try {
        const res = await fetch(`${url}profiles`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${sessionStorage.getItem("token")}`
          }
        });
        const profiles = await res.json();

        const totalProfiles = profiles.reduce(
          (acc, profile) => {
            if (profile.role === "operator")
              return { ...acc, operator: (acc.operator += 1) };
            if (profile.role === "supervisor")
              return { ...acc, supervisor: (acc.supervisor += 1) };
            return acc;
          },
          { operator: 0, supervisor: 0 }
        );

        var html = Template.templates.home({ totalProfiles, url });
        $("#root")
          .html(html)
          .show();

        crossroads.addRoute("/home", function () {
          if (role == "operator") {
            var html = Template.templates.homeOperator({ url });
            $("#root")
              .html(html)
              .show();
          } else {
            var html = Template.templates.home({ url });
            $("#root")
              .html(html)
              .show();
          }
        });
      } catch (err) {
        console.log(err);
      }
    }
  }

  crossroads.addRoute('/upload-sasaran', () => {
    var html = Template.templates.uploadSasaran({ url });
    $("#root").empty();
    $("#root")
      .html(html)
      .show();
  })

  const getRole = async arg => {
    const regionRes = await fetch(`${url}regions`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
      },
      method: 'get'
    })

    const regions = await regionRes.json()
    console.log(regions)
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
        var html = Template.templates.userOperator({ oper, url, regions });
        $("#root").empty();
        $("#root")
          .html(html)
          .show();
      } else if (sessionStorage.role == "admin" && arg == "admin") {
        var html = Template.templates.userAdmin({ oper, url, regions });
        $("#root").empty();
        $("#root")
          .html(html)
          .show();
      } else if (sessionStorage.role == "admin" && arg == "supervisor") {
        var html = Template.templates.userSupervisor({ oper, url, regions });
        $("#root").empty();
        $("#root")
          .html(html)
          .show();
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
    var html = Template.templates.recordStatistics({ url });
    $("#root").empty();
    $("#root")
      .html(html)
      .show();
  });

  crossroads.addRoute("/record-region", function () {
    var html = Template.templates.recordRegion({ url });
    $("#root").empty();
    $("#root")
      .html(html)
      .show();
  });

  crossroads.addRoute("/survey", function () {
    var survey = JSON.parse(sessionStorage.getItem("targetedSurvey"));
    console.log(survey);
    var gender = survey[0].gender;
    if (gender === "Male") {
      gender = true;
    } else {
      gender = false;
    }
    var html = Template.templates.survey({ survey, gender, url });
    $("#root").empty();
    $("#root")
      .html(html)
      .show();
  });

  async function question() {
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
      var html = Template.templates.questionSet({ ques, url });
      $("#root").empty();
      $("#root")
        .html(html)
        .show();
    } catch (err) {
      console.log(err);
    }
  }

  function newQuestion() {
    var ques = JSON.parse(sessionStorage.getItem("question"));
    var id = Object.keys(ques).length;
    id = id + 1;
    var html = Template.templates.newQuestion({ id, url });
    $("#root").empty();
    $("#root")
      .html(html)
      .show();
  }

  crossroads.addRoute("/question-set", question);
  crossroads.addRoute("/new-question", newQuestion);

  crossroads.addRoute("/result", function () {
    var html = Template.templates.result({ url });
    $("#root").empty();
    $("#root")
      .html(html)
      .show();
  });

  $(".knob2").knob({
    format: function (value) {
      return value + "%";
    }
  });

  // progress bars
  $(".progress .progress-bar").progressbar({
    display_text: "none"
  });

  // Visitors Statistics =============
  var d = [
    [1196463600000, 0],
    [1196550000000, 0],
    [1196636400000, 0],
    [1196722800000, 77],
    [1196809200000, 3636],
    [1196895600000, 3575],
    [1196982000000, 2736],
    [1197068400000, 1086],
    [1197154800000, 676],
    [1197241200000, 1205],
    [1197327600000, 906],
    [1197414000000, 710],
    [1197500400000, 639],
    [1197586800000, 540],
    [1197673200000, 435],
    [1197759600000, 301],
    [1197846000000, 575],
    [1197932400000, 481],
    [1198018800000, 591],
    [1198105200000, 608],
    [1198191600000, 459],
    [1198278000000, 234],
    [1198364400000, 1352],
    [1198450800000, 686],
    [1198537200000, 279],
    [1198623600000, 449],
    [1198710000000, 468],
    [1198796400000, 392],
    [1198882800000, 282],
    [1198969200000, 208],
    [1199055600000, 229],
    [1199142000000, 177],
    [1199228400000, 374],
    [1199314800000, 436],
    [1199401200000, 404],
    [1199487600000, 253],
    [1199574000000, 218],
    [1199660400000, 476],
    [1199746800000, 462],
    [1199833200000, 448],
    [1199919600000, 442],
    [1200006000000, 403],
    [1200092400000, 204],
    [1200178800000, 194],
    [1200265200000, 327],
    [1200351600000, 374],
    [1200438000000, 507],
    [1200524400000, 546],
    [1200610800000, 482],
    [1200697200000, 283],
    [1200783600000, 221],
    [1200870000000, 483],
    [1200956400000, 523],
    [1201042800000, 528],
    [1201129200000, 483],
    [1201215600000, 452],
    [1201302000000, 270],
    [1201388400000, 222],
    [1201474800000, 439],
    [1201561200000, 559],
    [1201647600000, 521],
    [1201734000000, 477],
    [1201820400000, 442],
    [1201906800000, 252],
    [1201993200000, 236],
    [1202079600000, 525],
    [1202166000000, 477],
    [1202252400000, 386],
    [1202338800000, 409],
    [1202425200000, 408],
    [1202511600000, 237],
    [1202598000000, 193],
    [1202684400000, 357],
    [1202770800000, 4414],
    [1202857200000, 3393],
    [1202943600000, 2353],
    [1203030000000, 1364],
    [1203116400000, 215],
    [1203202800000, 214],
    [1203289200000, 356],
    [1203375600000, 5599],
    [1203462000000, 1334],
    [1203548400000, 1348],
    [1203634800000, 1243],
    [1203721200000, 1126],
    [1203807600000, 1157],
    [1203894000000, 5288]
  ];
  // first correct the timestamps - they are recorded as the daily
  // midnights in UTC+0100, but Flot always displays dates in UTC
  // so we have to add one hour to hit the midnights in the plot
  for (var i = 0; i < d.length; ++i) {
    d[i][0] += 60 * 60 * 1000;
  }
  // helper for returning the weekends in a period
  function weekendAreas(axes) {
    var markings = [],
      d = new Date(axes.xaxis.min);

    // go to the first Saturday

    d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 1) % 7));
    d.setUTCSeconds(0);
    d.setUTCMinutes(0);
    d.setUTCHours(0);

    var i = d.getTime();

    // when we don't set yaxis, the rectangle automatically
    // extends to infinity upwards and downwards

    do {
      markings.push({ xaxis: { from: i, to: i + 2 * 24 * 60 * 60 * 1000 } });
      i += 7 * 24 * 60 * 60 * 1000;
    } while (i < axes.xaxis.max);

    return markings;
  }
  var options = {
    xaxis: {
      mode: "time",
      tickLength: 5
    },
    selection: {
      mode: "x"
    },
    grid: {
      markings: weekendAreas,
      borderColor: "#eaeaea",
      tickColor: "#eaeaea",
      hoverable: true,
      borderWidth: 1
    }
  };
  var plot = $.plot("#Visitors_chart", [d], options);
  // now connect the two
  $("#Visitors_chart").bind("plotselected", function (event, ranges) {
    // do the zooming
    $.each(plot.getXAxes(), function (_, axis) {
      var opts = axis.options;
      opts.min = ranges.xaxis.from;
      opts.max = ranges.xaxis.to;
    });
    plot.setupGrid();
    plot.draw();
    plot.clearSelection();

    // don't fire event on the overview to prevent eternal loop

    overview.setSelection(ranges, true);
  });
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
