const http = require("@jetbrains/youtrack-scripting-api/http");

const DISCORD_WEBHOOK_URL = "https://discordapp.com/api/webhooks/1383549282052866058/fxkmL-SiSi1mp9FYkC4D5C3n7k-W5XD1vlOYiUClgoO3IqUR5BnyRvFV5q6wfteSUBpe";

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
  return {
    embeds: [
        {
            type: "rich",
            title: `Opened ${issue.id} ${issue.summary}`,
            description: issue.description,
            color: "16466332",
            footer: {
              text: `Reported by: ${issue.reporter.fullName}`,
              icon_url: issue.reporter.avatarUrl
            },
            url: issue.url
        }
    ]
  };
}

function createPayloadResolved(issue) {
  return {
    embeds: [
        {
            type: "rich",
            title: `Resolved ${issue.id} ${issue.summary}`,
            description: issue.description,
            color: "16466332",
            footer: {
              text: `Resolved by: ${issue.updatedBy.fullName}`,
              icon_url: issue.updatedBy.avatarUrl
            },
            url: issue.url
        }
    ]
  };
}

function createPayloadReopened(issue) {
  return {
    embeds: [
        {
            type: "rich",
            title: `Reopened: ${issue.id} ${issue.summary}`,
            description: issue.description,
            color: "16466332",
            footer: {
              text: `Reopened by: ${issue.updatedBy.fullName}`,
              icon_url: issue.updatedBy.avatarUrl
            },
            url: issue.url
        }
    ]
  };
}

function createPayloadReassigned(issue, assignee, discordId) {
  const ping = discordId ? `<@${discordId}>` : `${assignee.fullName}`;
  return {
    embeds: [
        {
            type: "rich",
            title: `Reassigned: ${issue.id} ${issue.summary}`,
            description: `Assigned to ${ping}`,
            color: "16466332",
            url: issue.url
        }
    ]
  };
}


module.exports = {
  sendDiscordPayload,
  createPayloadCommented,
  createPayloadCreated,
  createPayloadResolved,
  createPayloadReopened,
  createPayloadReassigned
}