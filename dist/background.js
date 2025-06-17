/******/ (() => { // webpackBootstrap
/*!******************************************!*\
  !*** ./src/background/service-worker.js ***!
  \******************************************/
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { if (r) i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n;else { var o = function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); }; o("next", 0), o("throw", 1), o("return", 2); } }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
// Store the OpenAI API key
var apiKey = '';

// Debug logging
function debugLog(message) {
  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var timestamp = new Date().toISOString();
  var logMessage = data ? "".concat(timestamp, " - ").concat(message, ": ").concat(JSON.stringify(data)) : "".concat(timestamp, " - ").concat(message);
  console.log(logMessage);
}

// Initialize the extension
chrome.runtime.onInstalled.addListener(function () {
  debugLog('Extension installed/updated');
  // Request API key from user
  chrome.storage.local.get(['openaiApiKey'], function (result) {
    if (!result.openaiApiKey) {
      debugLog('No API key found, opening options page');
      chrome.runtime.openOptionsPage();
    } else {
      debugLog('API key found in storage');
      apiKey = result.openaiApiKey;
    }
  });
});

// Handle extension icon click
chrome.action.onClicked.addListener(function (tab) {
  debugLog('Extension icon clicked', {
    tabId: tab.id
  });
  chrome.sidePanel.open({
    tabId: tab.id
  });
});

// Handle messages from content script and side panel
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  debugLog('Received message', message);
  if (message.type === 'ANALYZE_CONTENT') {
    debugLog('Analyzing content');
    analyzeContent(message.content).then(function (summary) {
      debugLog('Content analyzed successfully');
      chrome.runtime.sendMessage({
        type: 'CONTENT_ANALYZED',
        summary: summary
      });
    })["catch"](function (error) {
      console.error('Error analyzing content:', error);
      debugLog('Error analyzing content', error);
      chrome.runtime.sendMessage({
        type: 'CONTENT_ANALYZED',
        summary: 'Error: Could not analyze content. Please check your API key.'
      });
    });
  } else if (message.type === 'ASK_QUESTION') {
    debugLog('Processing question', {
      question: message.question
    });
    answerQuestion(message.question, message.content).then(function (answer) {
      debugLog('Question answered successfully');
      sendResponse({
        answer: answer
      });
    })["catch"](function (error) {
      console.error('Error answering question:', error);
      debugLog('Error answering question', error);
      sendResponse({
        error: 'Could not answer question. Please check your API key.'
      });
    });
    return true; // Required for async sendResponse
  }
});

// Analyze content using OpenAI API
function analyzeContent(_x) {
  return _analyzeContent.apply(this, arguments);
} // Answer question using OpenAI API
function _analyzeContent() {
  _analyzeContent = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(content) {
    var systemMessage, response, data;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          if (apiKey) {
            _context.n = 1;
            break;
          }
          throw new Error('OpenAI API key not set');
        case 1:
          debugLog('Sending request to OpenAI API');
          systemMessage = "You are an AI assistant that summarizes articles and answers questions about them.\nFor summaries, provide:\n1. Key Takeaways (in a callout):\n   - List 3-5 main points\n   - Use bullet points\n   - Keep each point concise\n2. Summary:\n   - Write 2-3 paragraphs\n   - Focus on main ideas and context\n   - Use clear, concise language\n\nFor questions, provide clear and concise answers based on the article content.";
          _context.n = 2;
          return fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': "Bearer ".concat(apiKey)
            },
            body: JSON.stringify({
              model: 'gpt-3.5-turbo',
              messages: [{
                role: 'system',
                content: systemMessage
              }, {
                role: 'user',
                content: "Please summarize this article in markdown format, focusing on key points and main ideas:\n\n".concat(content)
              }],
              max_tokens: 500
            })
          });
        case 2:
          response = _context.v;
          if (response.ok) {
            _context.n = 3;
            break;
          }
          debugLog('OpenAI API error', {
            status: response.status
          });
          throw new Error('Failed to analyze content');
        case 3:
          _context.n = 4;
          return response.json();
        case 4:
          data = _context.v;
          debugLog('OpenAI API response', data);
          return _context.a(2, data.choices[0].message.content);
      }
    }, _callee);
  }));
  return _analyzeContent.apply(this, arguments);
}
function answerQuestion(_x2, _x3) {
  return _answerQuestion.apply(this, arguments);
} // Handle API key updates
function _answerQuestion() {
  _answerQuestion = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(question, content) {
    var systemMessage, response, data;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.n) {
        case 0:
          if (apiKey) {
            _context2.n = 1;
            break;
          }
          throw new Error('OpenAI API key not set');
        case 1:
          debugLog('Sending question to OpenAI API');
          systemMessage = "You are an AI assistant that summarizes articles and answers questions about them.\nFor summaries, provide:\n1. Key Takeaways (in a callout):\n   - List 3-5 main points\n   - Use bullet points\n   - Keep each point concise\n2. Summary:\n   - Write 2-3 paragraphs\n   - Focus on main ideas and context\n   - Use clear, concise language\n\nFor questions, provide clear and concise answers based on the article content.";
          _context2.n = 2;
          return fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': "Bearer ".concat(apiKey)
            },
            body: JSON.stringify({
              model: 'gpt-3.5-turbo',
              messages: [{
                role: 'system',
                content: systemMessage
              }, {
                role: 'user',
                content: "Here is the article content:\n\n".concat(content, "\n\nQuestion: ").concat(question)
              }],
              max_tokens: 500
            })
          });
        case 2:
          response = _context2.v;
          if (response.ok) {
            _context2.n = 3;
            break;
          }
          debugLog('OpenAI API error', {
            status: response.status
          });
          throw new Error('Failed to answer question');
        case 3:
          _context2.n = 4;
          return response.json();
        case 4:
          data = _context2.v;
          debugLog('OpenAI API response', data);
          return _context2.a(2, data.choices[0].message.content);
      }
    }, _callee2);
  }));
  return _answerQuestion.apply(this, arguments);
}
chrome.storage.onChanged.addListener(function (changes, namespace) {
  if (namespace === 'local' && changes.openaiApiKey) {
    debugLog('API key updated');
    apiKey = changes.openaiApiKey.newValue;
  }
});
/******/ })()
;
//# sourceMappingURL=background.js.map