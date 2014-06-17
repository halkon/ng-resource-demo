var grunt = require('grunt');

module.exports = {
    commitPush: {
        options: {
            stdout: true
        },
        command: [
            'git checkout master',
            'git pull',
            'git add .',
            'git commit -m "Build: Committing auto-generated reports"',
            'git push origin master'
        ].join('&&')
    },
    hooks: {
        command: [
            'rm -f .git/hooks/pre-commit',
            'cp tasks/git-hooks/pre-commit .git/hooks/',
            'chmod u+x .git/hooks/pre-commit'
        ].join(' && ')
    }
};
