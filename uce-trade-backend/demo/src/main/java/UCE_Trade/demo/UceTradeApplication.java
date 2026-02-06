package UCE_Trade.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableAsync; 

@SpringBootApplication
@EnableCaching 
@EnableAsync
public class UceTradeApplication {

    @jakarta.annotation.PostConstruct
    public void init() {
        java.util.TimeZone.setDefault(java.util.TimeZone.getTimeZone("America/Guayaquil"));
    }
    public static void main(String[] args) {
        SpringApplication.run(UceTradeApplication.class, args);
    }
} 