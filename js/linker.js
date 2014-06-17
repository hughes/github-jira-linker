var JIRA_LINK, PROJECTS;

var regex_str, regex, selector;

function wrapJiraLink(index, el) {
    var new_html = $(el).html().replace(regex,
        '<a href="' + JIRA_LINK + '/browse/$1" target="_blank">$1</a>');
    $(el).html(new_html);
}

chrome.storage.sync.get({
  subdomain: null,
  projects: null
}, function (options) {
  if (options.subdomain && options.projects) {
    JIRA_LINK = 'https://' + options.subdomain + '.atlassian.net';
    PROJECTS = options.projects;

    regex_str = '((' + PROJECTS.join('|') + ')-\\d+)';
    regex = new RegExp(regex_str, 'g');
    selector = 'p:regex("' + regex_str + '")';

    $(selector).each(wrapJiraLink);
  }
});
