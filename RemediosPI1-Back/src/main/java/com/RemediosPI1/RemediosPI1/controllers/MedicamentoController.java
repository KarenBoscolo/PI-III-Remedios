package com.RemediosPI1.RemediosPI1.controllers;

import java.util.List;
import java.util.Optional;

import com.RemediosPI1.RemediosPI1.enums.TarjaMedicamento;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.RemediosPI1.RemediosPI1.models.MedicamentoModel;
import com.RemediosPI1.RemediosPI1.services.MedicamentoService;

@RestController
@RequestMapping("/medicamentos")
public class MedicamentoController {

    private final MedicamentoService medicamentoService;

    public MedicamentoController(MedicamentoService medicamentoService) {
        this.medicamentoService = medicamentoService;
    }

    @GetMapping
    public ResponseEntity<List<MedicamentoModel>> getAllMedicamentos() {
        List<MedicamentoModel> medicamentos = medicamentoService.getAllMedicamentos();
        return ResponseEntity.ok(medicamentos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicamentoModel> getMedicamentoById(@PathVariable Long id) {
        Optional<MedicamentoModel> medicamento = medicamentoService.getMedicamentoById(id);
        return medicamento.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<MedicamentoModel> saveMedicamento(@RequestBody MedicamentoModel medicamento) {
        MedicamentoModel savedMedicamento = medicamentoService.saveMedicamento(medicamento);
        return ResponseEntity.ok(savedMedicamento);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedicamento(@PathVariable Long id) {
        medicamentoService.deleteMedicamento(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/tarja/{tarja}")
    public ResponseEntity<List<MedicamentoModel>> getMedicamentosByTarja(@PathVariable TarjaMedicamento tarja) {
        List<MedicamentoModel> medicamentos = medicamentoService.getMedicamentosByTarja(tarja);
        return ResponseEntity.ok(medicamentos);

    }
}
