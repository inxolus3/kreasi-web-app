// ZAP authentication script (script-based auth) - example for cookie-based login
// Use this inside ZAP: Script type = 'Authentication', Engine = 'Oracle Nashorn' (or 'ECMAScript')

function authenticate(helper, paramsValues, credentials) {
  // paramsValues contains any parameters you configured in the script (none here)
  var msg = helper.prepareMessage();
  msg.setRequestHeader('Content-Type', 'application/json');
  var body = JSON.stringify({
    email: credentials.getParam('username'),
    password: credentials.getParam('password')
  });
  msg.setRequestBody(body);
  msg.setRequestHeader('Content-Length', body.length.toString());

  // Replace host/port if necessary
  msg.getRequestHeader().setURI(new org.parosproxy.paros.network.HttpURI(helper.getBaseUrl() + '/api/auth/login'));

  var resp = helper.sendAndReceive(msg);
  // On success, server sets HttpOnly cookies; return the message
  return resp;
}

// Required by ZAP
function getRequiredParamsNames() {
  return [];
}

function getOptionalParamsNames() {
  return [];
}

function getCredentialParamsNames() {
  return ['username', 'password'];
}
