/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');
const Util = require('util.js');

const BACKGROUND_IMAGE_URL = '1min-sunset-bg.png';
const VIDEO_FILE_NAME = `sunset_`;
const VIDEO_FILE_EXT = '.mp4';
const VIDEO_TITLE = "１分間夕日動画";
const VIDEO_SUBTITLE = "この動画はpixabay.comの著作権フリーな動画を使用しています。";
const TITLE = '１分間サンセット';
const FILE_NUM = 5;

const WELCOME_MSG = 'このスキルでは、仕事の合間などに、すこーーーーしだけリラックスできる、夕日の動画をランダムで再生します。';
const REPROMPT_MSG = '動画を再生する場合は「再生」と言ってくださいね。';

const LaunchRequestIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest'
  },
  handle(handlerInput) {
    if (supportsDisplay(handlerInput)) {

      const pictureUrl = Util.getS3PreSignedUrl(`Media/${BACKGROUND_IMAGE_URL}`);
      let backgroundImage = new Alexa.ImageHelper()
        .withDescription(TITLE)
        .addImageInstance(pictureUrl)
        .getImage();

      let primaryText = new Alexa.RichTextContentHelper()
        .withPrimaryText(TITLE + 'へようこそ。')
        .getTextContent();

      let myTemplate = {
        type: 'BodyTemplate1',
        token: 'Welcome',
        backButton: 'HIDDEN',
        backgroundImage: backgroundImage,
        title: TITLE,
        textContent: primaryText,
      }

      handlerInput.responseBuilder
        .speak('<say-as interpret-as="interjection">お疲れ様です。</say-as>' + TITLE + 'へようこそ。' + WELCOME_MSG + REPROMPT_MSG)
        .withShouldEndSession(false)
        .reprompt(REPROMPT_MSG)
        .addRenderTemplateDirective(myTemplate);

    } else {
      handlerInput.responseBuilder
        .speak('<say-as interpret-as="interjection">ごめんなさい</say-as>、このスキルを利用するにはディスプレイ対応デバイスが必要です。<sub alias="エコーショウ">echo show</sub>か、<sub alias="エコースポット">echo spot</sub>でまた呼び出してくださいね')
        .withShouldEndSession(true)
        .withSimpleCard(TITLE, "このスキルを利用するにはディスプレイ対応デバイスが必要です。");
    }
    return handlerInput.responseBuilder
      .getResponse();
  }
};

const PlayVideoIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'PlayVideoIntent';
  },
  handle(handlerInput) {
    if (supportsDisplay(handlerInput)) {

      const pictureUrl = Util.getS3PreSignedUrl(`Media/${BACKGROUND_IMAGE_URL}`);
      let backgroundImage = new Alexa.ImageHelper()
        .withDescription(TITLE)
        .addImageInstance(pictureUrl)
        .getImage();

      let primaryText = new Alexa.RichTextContentHelper()
        .withPrimaryText('美しい夕日でリフレッシュしたら、またがんばりましょう！リラックスしたくなったときは、いつでもどうぞ！')
        .getTextContent();

      let myTemplate = {
        type: 'BodyTemplate1',
        token: 'Welcome',
        backButton: 'HIDDEN',
        backgroundImage: backgroundImage,
        title: TITLE,
        textContent: primaryText,
      }

      let VIDEO_URL = Util.getS3PreSignedUrl(`Media/${VIDEO_FILE_NAME}${getRandom(FILE_NUM)}${VIDEO_FILE_EXT}`);

      handlerInput.responseBuilder
        .speak('<say-as interpret-as="interjection">わかりました</say-as>。では、肩の力を抜いて、ゆっくり御覧ください。')
        .withShouldEndSession(true)
        .addVideoAppLaunchDirective(VIDEO_URL)
        .addRenderTemplateDirective(myTemplate)
        .withSimpleCard(TITLE, VIDEO_SUBTITLE)

    } else {
      handlerInput.responseBuilder
        .speak('<say-as interpret-as="interjection">ごめんなさい</say-as>、このスキルを利用するにはディスプレイ対応デバイスが必要です。<sub alias="エコーショウ">echo show</sub>か、<sub alias="エコースポット">echo spot</sub>でまた呼び出してくださいね')
        .withShouldEndSession(true)
        .withSimpleCard(TITLE, "このスキルを利用するにはディスプレイ対応デバイスが必要です。");
    }

    return handlerInput.responseBuilder
      .getResponse();

  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(WELCOME_MSG + '現在の動画数は' + FILE_NUM + '種類です。' + REPROMPT_MSG)
      .reprompt(REPROMPT_MSG)
      .withShouldEndSession(false)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'リラックスしたくなったら、<say-as interpret-as="interjection">いつでもどうぞ。</say-as>';

    return handlerInput.responseBuilder
      .speak(speechText)
      .withShouldEndSession(true)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('<say-as interpret-as="interjection">ごめんなさい</say-as>、うまく聞き取れなかったみたいです。もう一度言ってみていただけますか？')
      .reprompt('<say-as interpret-as="interjection">うーんと</say-as>、やっぱりうまく聞き取れなかったです。もう一度お願いできますか？')
      .withShouldEndSession(false)
      .getResponse();
  },
};

function supportsDisplay(handlerInput) {
  const hasDisplay =
    handlerInput.requestEnvelope.context &&
    handlerInput.requestEnvelope.context.System &&
    handlerInput.requestEnvelope.context.System.device &&
    handlerInput.requestEnvelope.context.System.device.supportedInterfaces &&
    handlerInput.requestEnvelope.context.System.device.supportedInterfaces.Display;
  return hasDisplay;
}

function getRandom(max) {
  var random = Math.floor( Math.random() * (max) ) + 1;
  return random;
}

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestIntentHandler,
    PlayVideoIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();