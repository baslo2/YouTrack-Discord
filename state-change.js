const entities = require("@jetbrains/youtrack-scripting-api/entities");
const shared = require("./_shared");

exports.rule = entities.Issue.onChange({
  title: "Send notification to Discord when an issue is reported, resolved, or reopened",
  guard: (ctx) => {
    return ctx.issue.becomesReported || ctx.issue.becomesResolved || ctx.issue.becomesUnresolved;
  },
  action: (ctx) => {
    const issue = ctx.issue;

    let payload;
    
    if (issue.becomesReported) {
      payload = shared.createPayloadCreated(issue);
    } else if (issue.becomesResolved) {
      payload = shared.createPayloadResolved(issue);
    } else if (issue.becomesUnresolved) {
      payload = shared.createPayloadReopened(issue);
    }
    
    const payloadString = JSON.stringify(payload);
    shared.sendDiscordPayload(payloadString);
  },
  requirements: {
    Priority: {
      type: entities.EnumField.fieldType
    },
    State: {
      type: entities.State.fieldType
    },
    Assignee: {
      type: entities.User.fieldType
    }
  }
});
