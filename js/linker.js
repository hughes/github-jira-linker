// TODO make these into extension options or even pull from jira directly
var JIRA_LINK = 'https://tophat.atlassian.net',
    PROJECTS = ['WEB', 'IOS', 'AN', 'PT', 'PROD'];

var regex_str = '((' + PROJECTS.join('|') + ')-\\d+)',
    regex = new RegExp(regex_str, 'g'),
    selector = 'p:regex("' + regex_str + '")';

function wrapJiraLink(index, el) {
    var new_html = $(el).html().replace(regex,
        '<a href="' + JIRA_LINK + '/browse/$1" target="_blank">$1</a>');
    $(el).html(new_html);
}

$(selector).each(wrapJiraLink);
