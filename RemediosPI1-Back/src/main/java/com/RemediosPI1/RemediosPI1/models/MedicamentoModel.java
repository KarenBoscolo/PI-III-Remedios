package com.RemediosPI1.RemediosPI1.models;

import com.RemediosPI1.RemediosPI1.enums.TarjaMedicamento;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "medicamento_tb")
public class MedicamentoModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String formula;
    private int quantidade;
    @Temporal(TemporalType.DATE)
    private LocalDate vencimento;

    @Enumerated(EnumType.STRING)
    private TarjaMedicamento tarja;

    @ManyToMany(mappedBy = "medicamentos")
    private List<PrescricaoModel> prescricoes;
}