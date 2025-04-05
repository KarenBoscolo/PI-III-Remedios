package com.RemediosPI1.RemediosPI1.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "paciente_tb")
public class PacienteModel {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String nome;
    private String cep;
    private String rua;
    private String numero;
    private String cidade;
    private String estado;
    private String cpf;
    private String telefone;
}
