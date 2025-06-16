const entities = require('@jetbrains/youtrack-scripting-api/entities');
const shared = require('./_shared');

exports.rule = entities.Issue.onChange({
  title: "Send notification to Discord when an issue is commented",
  guard: (ctx) => {
    return ctx.issue.comments;
  },
  action: (ctx) => {
    const comments = ctx.issue.comments;
    
    comments.added.forEach((c) => {      
      const payloadString = JSON.stringify(shared.createPayloadCommented(c));
      shared.sendDiscordPayload(payloadString);
    });
   
  },
  requirements: {}
});