var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var mkdirp = require('mkdirp');

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
        type    : 'list',
        name    : 'css',
        message : 'Which CSS preprocessors do you use?',
        choices : ['LESS', 'Stylus', 'SCSS', 'Sass'],
        filter  : function(val) {
          return val.toLowerCase();
        }
      },
      {
        type    : 'list',
        name    : 'html',
        message : 'Which HTML preprocessors do you use?',
        choices : ['EJS', 'Jade'],
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
      },
      {
        type    : 'confirm',
        name    : 'circleci',
        message : 'Would you like to deploy with Circle CI?',
        default : false
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
    this.log(yosay('Gotcha!'));
  },

  writing: function () {
    mkdirp(this.destinationPath('src'));
    var templates = [
      { "src": "gitignore", "dest": ".gitignore" },
      { "src": "package.json" },
      { "src": "bin" },
      { "src": "src/index.jade", "when": this.html === 'jade' },
      { "src": "src/index.ejs", "when": this.html === 'ejs' },
      { "src": "src/_layout.jade", "when": this.html === 'jade' },
      { "src": "src/_layout.ejs", "when": this.html === 'ejs' },
      { "src": "src/main.less", "when": this.css === 'less' },
      { "src": "src/main.styl", "when": this.css === 'stylus' },
      { "src": "src/main.scss", "when": this.css === 'scss' },
      { "src": "src/main.sass", "when": this.css === 'sass' },
      { "src": "circle.yml", "when": this.circleci },
      { "src": "src/circle.yml", "when": this.circleci },
      { "src": "src/CNAME", "when": typeof this.cname === 'string' }
    ];

    for (var key in templates) {
      var template = templates[key];
      var dest = template.dest === undefined ? template.src : template.dest;
      if (template.when === undefined || template.when === true) {
        this.fs.copy(
          this.templatePath(template.src),
          this.destinationPath(dest)
        );
      }
    }
  },

  install: function () {
    this.log(yosay('Install dependencies'));
    this.npmInstall();
  },

  end: function () {
    this.log(yosay('Finished'));
  }
});

module.exports = HarpGhPagesGenerator
