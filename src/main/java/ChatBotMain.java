import discord4j.core.DiscordClient;
import discord4j.core.DiscordClientBuilder;
import discord4j.core.event.domain.message.MessageCreateEvent;

public class ChatBotMain {

    public static void main(String[] args) {

        final DiscordClient client = new DiscordClientBuilder("token").build();

        client.getEventDispatcher().on(MessageCreateEvent.class)
                .subscribe(event -> handleMessageEvent(event));

        client.login().block();
    }

    private static void handleMessageEvent(MessageCreateEvent event) {
        final String messageContent = event.getMessage().getContent().orElse("");

        if (messageContent.startsWith("!echo")) {
            final String trimmedMessage = messageContent.replaceFirst("!echo\\s*", "");

            event.getMessage().getChannel().block()
                    .createMessage("Hello! You said " + trimmedMessage).block();
        }
    }
}
