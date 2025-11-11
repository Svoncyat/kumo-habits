package com.kumo.www;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@EnableJpaRepositories
public class KumoHabitsApplication {

	public static void main(String[] args) {
		SpringApplication.run(KumoHabitsApplication.class, args);
	}

}
