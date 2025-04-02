package com.RemediosPI1.RemediosPI1.clients;

import com.RemediosPI1.RemediosPI1.dto.ViaCepDTO;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class ViaCepClient {

    private static final String VIA_CEP_URL = "https://viacep.com.br/ws/{cep}/json/";

    public ViaCepDTO buscarCep(String cep) {
        RestTemplate restTemplate = new RestTemplate();
        return restTemplate.getForObject(VIA_CEP_URL, ViaCepDTO.class, cep);
    }
}
