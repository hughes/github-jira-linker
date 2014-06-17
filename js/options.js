var subdomain;
var projects;

function renderProjects() {
  var i, project, results=$('#results');
  for (i=0; i<projects.length; i++) {
    project = projects[i];
    results.append('<li>' + project + '</li>');
  }
}

function saveProjects() {
  chrome.storage.sync.set({
    subdomain: subdomain,
    projects: projects
  }, function () {
    alert('Saved options');
  });
}

function parseProjects(data) {
  if (data && Array.isArray(data)) { // TODO fail handling
    var i, project, projectList = [];
    for (i=0; i<data.length; i++) {
      project = data[i];
      if ('key' in project) {
        projectList.push(project.key);
      }
    }
    projects = projectList;
    saveProjects();
    renderProjects();
  }
}

function fetchProjects() {
  if (subdomain) {
    var url = 'https://' + subdomain + '.atlassian.net/rest/api/2/project';
    $.get(url).done(parseProjects);  // TODO fail handling
  }
}

function saveSubdomain() {
  subdomain = $('#subdomain').val();
  fetchProjects();
  $('#fetch').focus();
  return false;
}

function bindOptions() {
  $('#fetch').click(saveSubdomain);
  $('form').submit(saveSubdomain);
}

function loadProjects() {
  chrome.storage.sync.get({
    subdomain: null,
    projects: null
  }, function (options) {
    if (options.subdomain) {
      subdomain = options.subdomain;
      $('#subdomain').val(subdomain);
    }
    if (options.projects) {
      projects = options.projects;
      renderProjects();
    }
  });
}

function init() {
  loadProjects();
  bindOptions();
}

document.addEventListener('DOMContentLoaded', init);
