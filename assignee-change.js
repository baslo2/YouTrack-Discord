const entities = require("@jetbrains/youtrack-scripting-api/entities");
const shared = require("./_shared");

exports.rule = entities.Issue.onChange({
  title: "Send notification to Discord when an issue is reassigned",
  guard: (ctx) => {
    return ctx.issue.fields.isChanged(ctx.Assignee) && !ctx.issue.becomesReported;
  },
  action: (ctx) => {
    const issue = ctx.issue;
	
    const newAssignee = issue.fields.Assignee;
    const discordId = shared.getDiscordUserId(newAssignee);
    shared.sendDiscordPayload(shared.createPayloadReassigned(issue, newAssignee, discordId));
  },
  requirements: {
    Assignee: {
      type: entities.User.fieldType
    }
  }
});
