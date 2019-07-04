module.exports = function(grunt) {
  grunt.initConfig({
    sass: {
      options: {
        includePaths: ["node_modules/bootstrap-sass/assets/stylesheets"]
      },
      dist: {
        options: {
          outputStyle: "compressed"
        },
        files: [
          {
            "css/main.css": "css/main.scss" /* 'All main SCSS' */,
            "css/color_skins.css":
              "css/color_skins.scss" /* 'All Color Option' */,

            "css/inbox.css":
              "css/pages/inbox.scss" /* 'inbox App SCSS to CSS' */,
            "css/chatapp.css":
              "css/pages/chatapp.scss" /* 'Chat App SCSS to CSS' */,
            "css/blog.css": "css/pages/blog.scss" /* 'Blog App SCSS to CSS' */
          }
        ]
      }
    },
    uglify: {
      my_target: {
        files: {
          "js/libscripts.bundle.js": [
            "js/jquery-3.3.1.min.js",
            "js/popper.min.js",
            "js/bootstrap.js"
          ] /* main js*/,

          "js/vendorscripts.bundle.js": [
            "js/metisMenu.js",
            "js/jquery.slimscroll.min.js",
            "js/bootstrap-progressbar.min.js",
            "js/jquery.sparkline.min.js",
            "js/waitMe.js"
          ] /* coman js*/,

          "js/mainscripts.bundle.js": ["js/common.js"] /*coman js*/,

          "js/morrisscripts.bundle.js": [
            "js/raphael.min.js",
            "js/morris.js"
          ] /* Morris Plugin Js */,

          "js/knob.bundle.js": ["js/jquery.knob.min.js"] /* knob js*/,
          "js/chartist.bundle.js": [
            "js/chartist.min.js",
            "js/chartist-plugin-tooltip.min.js",
            "js/chartist-plugin-axistitle.min.js",
            "js/chartist-plugin-legend.js",
            "js/Chart.bundle.js"
          ] /*chartist js*/,
          "js/index.jvectormap.bundle.js": [
            "js/jquery-jvectormap-2.0.3.min.js",
            "js/jquery-jvectormap-world-mill-en.js",
            "js/jquery-jvectormap-in-mill.js",
            "js/jquery-jvectormap-us-aea-en.js"
          ] /* ChartJs js*/,

          "js/fullcalendarscripts.bundle.js": [
            "js/moment.min.js",
            "js/fullcalendar.js"
          ] /* calender page js */,

          "js/easypiechart.bundle.js": [
            "js/jquery.easypiechart.min.js",
            "js/easy-pie-chart.init.js"
          ],

          "js/datatablescripts.bundle.js": [
            "js/jquery.dataTables.min.js",
            "js/dataTables.bootstrap4.min.js"
          ] /* Jquery DataTable Plugin Js  */,

          "js/flotscripts.bundle.js": [
            "js/jquery.flot.js",
            "js/jquery.flot.resize.js",
            "js/jquery.flot.pie.js",
            "js/jquery.flot.categories.js",
            "js/jquery.flot.time.js"
          ] /* Flot Chart js*/
        }
      }
    }
  });
  grunt.loadNpmTasks("grunt-sass");
  grunt.loadNpmTasks("grunt-contrib-uglify");

  grunt.registerTask("buildcss", ["sass"]);
  grunt.registerTask("buildjs", ["uglify"]);
};
