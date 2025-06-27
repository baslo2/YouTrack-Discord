const http = require("@jetbrains/youtrack-scripting-api/http");

const DISCORD_WEBHOOK_URL = "";

function sendDiscordPayload(payloadString) {
    const connection = new http.Connection(DISCORD_WEBHOOK_URL, null, 2000);
    connection.addHeader("Content-Type", "application/json");
    const response = connection.postSync("", null, payloadString);
   
    if (!response.isSuccess) {
      console.warn("Failed to post notification to Discord. Details: " + response.toString());
    }
}

function createPayloadCommented(comment) {
  return {
    embeds: [
        {
            type: "rich",
            title: `${comment.author.fullName} commented on ${comment.issue.id} ${comment.issue.summary}`,
            description: comment.text,
            color: "16466332",
            footer: {
              text: comment.author.fullName,
              icon_url: comment.author.avatarUrl
            },
            url: comment.url
        }
    ]
  };
}

function createPayloadCreated(issue) {
  let msg = `:new: New Issue opened by ${issue.updatedBy.fullName}`;
  if(issue.fields.Assignee) {
  	const discordId = getDiscordUserId(issue.fields.Assignee);
  	const ping = _createUserPing(discordId, issue.fields.Assignee.fullName);
  	msg +=`, assigned to ${ping}`;
  }
  return {
    embeds: [_createIssueEmbed(issue)],
    content: msg
  };
}

function createPayloadResolved(issue) {
  return {
    embeds: [_createIssueEmbed(issue)],
    content: `:white_check_mark: Resolved by ${issue.updatedBy.fullName} :tada:`
  };
}

function createPayloadReopened(issue) {
  return {
    embeds: [_createIssueEmbed(issue)],
    content: `:repeat: Reopened by ${issue.updatedBy.fullName}`
  };
}

function createPayloadReassigned(issue, assignee, discordId) {
  const ping = _createUserPing(discordId, assignee.fullName);
  return {
    embeds: [_createIssueEmbed(issue)],
    content: `Reassigned to ${ping}`,
  };
}

function _createIssueEmbed(issue) {
  return {
    type: "rich",
    title: `${issue.id} ${issue.summary}`,
    description: issue.summary,
    color: "16466332",
    url: issue.url,
    footer: {
      text: `Assignee: ${issue.fields.Assignee.fullName}`,
      icon_url: issue.fields.Assignee.avatarUrl
    },
  }
}

function _createUserPing(discordUserId, discordUserName) {
  return discordUserId ? `<@${discordUserId}>` : `${discordUserName}`;
}

function getDiscordUserId(user) {
    return user.attributes["Discord ID"];
}

function _createSilentPing() {
  return { allowed_mentions: {parse: []} };
}

module.exports = {
  sendDiscordPayload,
  createPayloadCommented,
  createPayloadCreated,
  createPayloadResolved,
  createPayloadReopened,
  createPayloadReassigned,
  getDiscordUserId
}
