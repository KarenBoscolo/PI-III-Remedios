package com.RemediosPI1.RemediosPI1.enums;

public enum TarjaMedicamento {

    SEM_TARJA("Sem Tarja"),
    AMARELA("Tarja Amarela"),
    VERMELHA("Tarja Vermelha"),
    PRETA("Tarja Preta");

    private final String descricao;

    TarjaMedicamento(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }

}
