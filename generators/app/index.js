var Generator = require('yeoman-generator');
var yosay = require('yosay');
var mkdirp = require('mkdirp');
var chalk = require('chalk');

var HarpGhPagesGenerator = class extends Generator {
  prompting() {
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
        name    : 'markdown',
        message : 'Would you like to use Markdown for html content?',
        default : false
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
      this.markdown = answers.markdown;
      this.circleci = answers.circleci;
      this.cname = answers.cname;
    }.bind(this));
  }

  configuring() {
    this.log(yosay('Gotcha! Generating template files.'));
  }

  writing() {
    var data = {
      title: this.name,
      cname: this.cname
    };
    mkdirp(this.destinationPath('src'));
    var templates = [
      { "src": "gitignore", "dest": ".gitignore" },
      { "src": "package.json" },
      { "src": "bin" },
      { "src": "src/index.jade", "when": !this.markdown && this.html === 'jade' },
      { "src": "src/index.ejs", "when": !this.markdown && this.html === 'ejs' },
      { "src": "src/index.md", "when": this.markdown },
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
        this.fs.copyTpl(
          this.templatePath(template.src),
          this.destinationPath(dest),
          data
        );
      }
    }
  }

  install() {
    this.log(yosay('Installing dependencies.'));
    this.installDependencies({
      bower: false,
      npm: true,
      callback: function() {
        this.log(yosay('Running first compile'));
        this.spawnCommandSync('npm', ['run', 'compile']);
      }.bind(this)
    });
  }

  end() {
    this.log(yosay('Finished generating.'));
    this.log(chalk.green.bold.underline('Commands:'));
    this.log(chalk.red.bold('npm run preview') + ': you can preview your project in ' + chalk.blue.bold.underline('localhost:9000') + ' by Harp server');
    this.log(chalk.red.bold('npm run compile') + ': build your harp project manually.');
    this.log(chalk.red.bold('npm run publish') + ': publish to GitHub Page of projeject repository');

    this.log("\n" + chalk.green.bold.underline('Others:'));
    this.log('Harp Documentation: ' + chalk.blue.bold.underline('https://harpjs.com/docs/'));
    if (typeof this.cname === 'string') {
      this.log('Setup custom domain to GitHub Pages: ' + chalk.blue.bold.underline('https://help.github.com/articles/using-a-custom-domain-with-github-pages/'));
    }
    if (this.circleci) {
      this.log('For setup to build and publish with Circle CI: '+ chalk.blue.bold.underline('https://circleci.com/add-projects'));
    }
  }
};

module.exports = HarpGhPagesGenerator;
