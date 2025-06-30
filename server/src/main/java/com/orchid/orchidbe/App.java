package com.orchid.orchidbe;

import io.github.lcaohoanq.JavaBrowserLauncher;
import java.util.Arrays;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;


@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.orchid.orchidbe.repositories")
@EntityScan(basePackages = "com.orchid.orchidbe.domain")
public class App {

    public static void main(String[] args) {
        var context = SpringApplication.run(App.class, args);

        var env = context.getEnvironment();
        var activeProfiles = env.getActiveProfiles();
        if (!Arrays.asList(activeProfiles).contains("docker")) {
            var port = env.getProperty("server.port", "8080");
            JavaBrowserLauncher.doHealthCheckThenOpenHomePage(
                "http://localhost:" + port + "/actuator/health",
                "http://localhost:" + port + "/swagger-ui.html");
        }
    }

}
