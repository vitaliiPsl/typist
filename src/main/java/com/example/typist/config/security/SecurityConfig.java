package com.example.typist.config.security;

import com.example.typist.config.security.jwt.JwtTokenVerifierFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    private final UserDetailsService userDetailsService;
    private final JwtTokenVerifierFilter jwtTokenFilter;

    @Autowired
    SecurityConfig(UserDetailsService userDetailsService, JwtTokenVerifierFilter jwtFilter){
        this.userDetailsService = userDetailsService;
        this.jwtTokenFilter = jwtFilter;
    }

    @Bean
    public AuthenticationManager getAuthenticationManager() throws Exception {
        return this.authenticationManager();
    }

    @Override
    public void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService).passwordEncoder(NoOpPasswordEncoder.getInstance());
    }

    @Override
    public void configure(HttpSecurity http) throws Exception {
        http.cors().and().csrf().disable();

        http.authorizeRequests()
                .antMatchers("/api/auth/**").permitAll()
                .antMatchers("/api/tests/top").permitAll()
                .antMatchers(HttpMethod.GET, "/api/users/*").permitAll()
                .anyRequest().authenticated();

        http.sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS);

        http.addFilterBefore(jwtTokenFilter, UsernamePasswordAuthenticationFilter.class);
    }
}
