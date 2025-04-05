package com.RemediosPI1.RemediosPI1.repositories;

import java.util.List;

import com.RemediosPI1.RemediosPI1.enums.TarjaMedicamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.RemediosPI1.RemediosPI1.models.MedicamentoModel;

@Repository
public interface MedicamentoRepository extends JpaRepository<MedicamentoModel, Long> {
    List<MedicamentoModel> findByTarja(TarjaMedicamento tarja);

    @Query
    List<MedicamentoModel> findByFormulaAndQuantidadeGreaterThanOrderByVencimentoAsc(String formula, int quantidade);
}

