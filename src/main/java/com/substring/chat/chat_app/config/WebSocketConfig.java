package com.substring.chat.chat_app.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
       config.enableSimpleBroker("/topic");//all message form server publish on /topic
        config.setApplicationDestinationPrefixes("/app");//handle to controller for that messages
        // /app/chat
        //server-side: @MessagingMapping("/chat")
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
       registry.addEndpoint("/chat")//connection establishment
               .setAllowedOrigins(AppConstants.FRONT_END_BASE_URL)
               .withSockJS(); //enable websocket polbag
    }
    // /chat endpoint pe apka connection establish hoga
}
