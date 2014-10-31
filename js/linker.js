(function () {
  'use strict';
  var JIRA_LINK, PROJECTS;
  var issue_regex_str, issue_regex, selector;

  function walk(node) {
    var child = node.firstChild, next;
    while (child) {
      next = child.nextSibling;
      walk(child);
      child = next;
    }
    if (shouldWrapLink(node)) {
      wrapJiraLink(node);
    }
  }

  function shouldWrapLink(node) {
    return (
      node.nodeType === Node.TEXT_NODE &&
      issue_regex.test(node.textContent) &&
      !hasInteractiveParent(node)
    );
  }

  function hasInteractiveParent(node) {
    // partial implementation of
    // https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Content_categories
    if (node.parentNode) {
      if (node.parentNode.nodeName === 'A') {
        return true;
      } else {
        return hasInteractiveParent(node.parentNode);
      }
    }
    return false;
  }

  function wrapJiraLink(originalNode) {
    var parent = originalNode.parentNode;
    var matches = originalNode.textContent.match(issue_regex);
    var textChunks = originalNode.textContent.split(issue_regex);
    var newLinkNode, newTextNode;

    textChunks.forEach(function (chunk, i) {
      newTextNode = document.createTextNode(chunk);
      parent.insertBefore(newTextNode, originalNode);

      if (i < matches.length) {
        newLinkNode = document.createElement('A');
        newLinkNode.setAttribute('href', JIRA_LINK + '/browse/' + matches[i]);
        newLinkNode.setAttribute('target', '_blank');
        newLinkNode.innerHTML = matches[i];
        parent.insertBefore(newLinkNode, originalNode);
      }
    });

    parent.removeChild(originalNode);
  }

  chrome.storage.sync.get({
    subdomain: null,
    projects: null
  }, function (options) {
    if (options.subdomain && options.projects) {
      JIRA_LINK = 'https://' + options.subdomain + '.atlassian.net';
      PROJECTS = options.projects;

      issue_regex_str = PROJECTS.join('-\\d+|') + '-\\d+';
      issue_regex = new RegExp(issue_regex_str, 'g');

      walk(document.body);
    }
  });
})();
