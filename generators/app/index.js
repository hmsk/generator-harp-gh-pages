var yeoman = require('yeoman-generator');
var yosay = require('yosay');

var HarpGhPagesGenerator = yeoman.Base.extend({
  prompting: function () {
    var prompts = [
      {
        type    : 'input',
        name    : 'name',
        message : 'Your project name',
        default : this.destinationRoot().split('/')[this.destinationRoot().split('/').length - 1]
      },
      {
        type    : 'confirm',
        name    : 'circleci',
        message : 'Would you like to deploy with Circle CI?',
        default : false
      },
      {
        type    : 'list',
        name    : 'css',
        message : 'Which CSS preprocessors do you use?',
        choices : ['LESS', 'Stylus', 'Sass'],
        filter  : function(val) {
          return val.toLowerCase();
        }
      },
      {
        type    : 'list',
        name    : 'html',
        message : 'Which HTML preprocessors do you use?',
        choices : ['EJS', 'Jade', 'Markdown'],
        filter  : function(val) {
          return val.toLowerCase();
        }
      },
      {
        type    : 'confirm',
        name    : 'custom_domain',
        message : 'Would you like to configure your custom domain for GitHub Pages?',
        default : false
      },
      {
        type    : 'input',
        name    : 'cname',
        message : 'Put your custom domain',
        default : 'awesome.example.com',
        when: function(answers) {
          return answers.custom_domain;
        }
      }
    ];

    return this.prompt(prompts).then(function(answers) {
      this.name = answers.name;
      this.css = answers.css;
      this.html = answers.html;
      this.circleci = answers.circleci;
      this.cname = answers.cname;
    }.bind(this));
  },

  configuring: function () {
    // this.log(this.name);
    // this.log(this.circleci);
    // this.log(this.cname);
  },

  writing: function () {
    this.log(yosay('Writing files'));
    this.fs.copy(
      this.templatePath('package.json'),
      this.destinationPath('package.json')
    );
  },

  install: function () {
    this.log(yosay('Installing dependencies.'));
    this.npmInstall();
  },

  end: function () {
    this.log(yosay('Finished'));
  }
});

module.exports = HarpGhPagesGenerator
