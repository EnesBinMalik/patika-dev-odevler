/**
 * SpringBootArchitectureModal - Spring Boot 3 Katmanlı Mimari & SOLID Raporu
 * Lombok, Swagger-UI (OpenAPI), Spring Data JPA, Spring Security Entegrasyonu
 * Mimar: Enes Öztürk
 */

import React, { useState } from 'react';
import { 
  FileCode2, 
  Layers, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Copy, 
  Check, 
  Cpu, 
  BookOpen, 
  FileText 
} from 'lucide-react';

export const SpringBootArchitectureModal: React.FC = () => {
  const [activeCodeTab, setActiveCodeTab] = useState<'entity' | 'repo' | 'service' | 'controller' | 'security'>('entity');
  const [copied, setCopied] = useState<boolean>(false);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const codeSnippets = {
    entity: `package com.ozturkbank.atm.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * User Entity - Spring Data JPA
 * Mimar: Enes Öztürk
 * Admin(1) - User(N) ve User(1) - Account(N) İlişkileri
 */
@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false, unique = true, length = 11)
    private String tcNo;

    @Column(nullable = false, length = 100)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false)
    private String passwordHash; // BCryptPasswordEncoder ile maskeli

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role; // ADMIN, CUSTOMER

    @Column(nullable = false)
    private boolean isBlocked = false;

    @Column(nullable = false)
    private int failedLoginAttempts = 0; // 3 deneme limiti

    // Admin (1) - User (N) İlişkisi
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id")
    private Admin admin;

    // User (1) - Account (N) İlişkisi
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Account> accounts;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}`,

    repo: `package com.ozturkbank.atm.repository;

import com.ozturkbank.atm.dto.CustomerAccountJoinDto;
import com.ozturkbank.atm.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.Optional;

/**
 * Spring Data JPA Repository Layer with Paging & Custom INNER JOIN
 * Mimar: Enes Öztürk
 */
@Repository
public interface UserRepository extends JpaRepository<User, String> {

    Optional<User> findByTcNo(String tcNo);

    Optional<User> findByEmail(String email);

    // Paging (Sayfalama) Desteği
    Page<User> findAll(Pageable pageable);

    /**
     * Admin için SQL INNER JOIN Sorgusu:
     * Hangi müşterinin ne kadar parası var tek sorguda çeker.
     */
    @Query("SELECT new com.ozturkbank.atm.dto.CustomerAccountJoinDto(" +
           "u.id, u.tcNo, u.fullName, u.email, u.isBlocked, " +
           "a.accountNumber, a.iban, a.balance, a.accountType) " +
           "FROM User u INNER JOIN u.accounts a WHERE u.role = 'CUSTOMER'")
    Page<CustomerAccountJoinDto> findCustomerBalancesWithInnerJoin(Pageable pageable);
}`,

    service: `package com.ozturkbank.atm.service.impl;

import com.ozturkbank.atm.entity.*;
import com.ozturkbank.atm.repository.*;
import com.ozturkbank.atm.service.TransactionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;

/**
 * TransactionService - İş Mantığı ve Bakiye Doğrulama
 * S.O.L.I.D: Single Responsibility & Katmanlı Mimari
 * Mimar: Enes Öztürk
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class TransactionServiceImpl implements TransactionService {

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final AuditLogService auditLogService;

    @Override
    @Transactional
    public Transaction withdraw(String accountId, BigDecimal amount, String userId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new AccountNotFoundException("Hesap bulunamadı!"));

        // Kural: Doğrulama: Eğer müşterinin parası yoksa para çekemez!
        if (account.getBalance().compareTo(amount) < 0) {
            log.warn("Para çekme reddedildi: Yetersiz bakiye. Tutar: {}, Bakiye: {}", amount, account.getBalance());
            throw new InsufficientBalanceException("Yetersiz Bakiye! Hesabınızda yeterli tutar yok.");
        }

        account.setBalance(account.getBalance().subtract(amount));
        accountRepository.save(account);

        Transaction trx = Transaction.builder()
                .sourceAccount(account)
                .amount(amount)
                .transactionType(TransactionType.WITHDRAW)
                .balanceAfter(account.getBalance())
                .executedByUserId(userId)
                .build();

        transactionRepository.save(trx);
        auditLogService.logAction(LogAction.MONEY_WITHDRAWN, "Para çekildi: " + amount + " TL");
        return trx;
    }
}`,

    controller: `package com.ozturkbank.atm.controller;

import com.ozturkbank.atm.dto.*;
import com.ozturkbank.atm.service.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * ATM & Bankacılık REST API Controller
 * Swagger-UI / OpenAPI 3.0 Entegrasyonu
 * Mimar: Enes Öztürk
 */
@RestController
@RequestMapping("/api/v1/atm")
@RequiredArgsConstructor
@Tag(name = "Öztürk Bank ATM API", description = "Enes Öztürk İmzalı ATM ve Banka Yönetim Uç Noktaları")
@CrossOrigin(origins = "*")
public class AtmController {

    private final TransactionService transactionService;
    private final AuthService authService;

    @PostMapping("/withdraw")
    @Operation(summary = "Para Çekme", description = "Bakiye doğrulaması yapar, parası yoksa hata fırlatır.")
    public ResponseEntity<TransactionResponseDto> withdraw(@Valid @RequestBody WithdrawRequestDto request) {
        Transaction trx = transactionService.withdraw(request.getAccountId(), request.getAmount(), request.getUserId());
        return ResponseEntity.ok(TransactionResponseDto.fromEntity(trx));
    }

    @PostMapping("/deposit")
    @Operation(summary = "Para Yatırma", description = "Hesaba para ekler ve bakiye artırır.")
    public ResponseEntity<TransactionResponseDto> deposit(@Valid @RequestBody DepositRequestDto request) {
        Transaction trx = transactionService.deposit(request.getAccountId(), request.getAmount(), request.getUserId());
        return ResponseEntity.ok(TransactionResponseDto.fromEntity(trx));
    }

    @GetMapping("/admin/customers-join")
    @Operation(summary = "SQL INNER JOIN Müşteri Bakiye Listesi", description = "Paging destekli müşteri ve bakiye dökümü")
    public ResponseEntity<Page<CustomerAccountJoinDto>> getCustomerBalances(Pageable pageable) {
        return ResponseEntity.ok(authService.getCustomerBalancesPaged(pageable));
    }
}`,

    security: `package com.ozturkbank.atm.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Spring Security 6 Yapılandırması (Bahar Güvenliği)
 * Şifreler BCrypt ile maskelenmiş ve güvenli tutulur
 * Mimar: Enes Öztürk
 */
@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        // Şifreler veritabanında maskelenmiş/hashlenmiş tutulur
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/v1/auth/**", "/swagger-ui/**", "/v3/api-docs/**").permitAll()
                .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            );
        return http.build();
    }
}`
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Mimari Başlık & Enes Öztürk İmzası */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 rounded-2xl p-6 border border-emerald-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs uppercase tracking-wider text-emerald-400 font-mono font-bold">
              Spring Boot 3 Enterprise Layered Architecture
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">
            Öztürk Bank Kurumsal Katmanlı Mimari Raporu
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Spring Data JPA, Spring Security (BCrypt), Lombok, Swagger-UI (OpenAPI), S.O.L.I.D Prensipleri
          </p>
        </div>

        <div className="bg-slate-950 px-4 py-2 rounded-xl border border-emerald-500/30 text-right">
          <span className="text-[10px] text-slate-400 block font-mono">SİSTEM BAŞ MİMARI</span>
          <span className="font-extrabold text-amber-300 text-sm">Enes Öztürk</span>
        </div>
      </div>

      {/* S.O.L.I.D Prensipleri Değerlendirme Tablosu */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
        <h3 className="font-bold text-white text-base flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>S.O.L.I.D & Clean Code Uyumluluk Beyanı</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-amber-400 font-black text-sm block">S - SRP</span>
            <h4 className="text-xs font-bold text-white">Single Responsibility</h4>
            <p className="text-[11px] text-slate-400">
              Auth, Transaction, Account ve Logging servislerinin her biri yalnızca tek bir sorumluluğu üstlenir.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-emerald-400 font-black text-sm block">O - OCP</span>
            <h4 className="text-xs font-bold text-white">Open / Closed</h4>
            <p className="text-[11px] text-slate-400">
              FeeCalculationStrategy ve Account sınıfları yeni hesap türlerine açık, mevcut koda dokunmadan genişletilebilir.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-sky-400 font-black text-sm block">L - LSP</span>
            <h4 className="text-xs font-bold text-white">Liskov Substitution</h4>
            <p className="text-[11px] text-slate-400">
              CustomerUser ve AdminUser, temel User sınıfının yerine hiçbir yan etki olmadan polimorfik olarak geçebilir.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-purple-400 font-black text-sm block">I - ISP</span>
            <h4 className="text-xs font-bold text-white">Interface Segregation</h4>
            <p className="text-[11px] text-slate-400">
              IRepository, ITransactionStrategy ve IBankEventListener ince ve odaklı arayüzlere bölünmüştür.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-rose-400 font-black text-sm block">D - DIP</span>
            <h4 className="text-xs font-bold text-white">Dependency Inversion</h4>
            <p className="text-[11px] text-slate-400">
              Üst katman servisleri somut sınıflara değil, IRepository ve IFeeStrategy gibi soyutlamalara bağımlıdır.
            </p>
          </div>
        </div>
      </div>

      {/* Spring Boot Kaynak Kod Görüntüleyici */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveCodeTab('entity')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all ${
                activeCodeTab === 'entity' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              @Entity (User.java)
            </button>
            <button
              onClick={() => setActiveCodeTab('repo')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all ${
                activeCodeTab === 'repo' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              @Repository (Inner Join)
            </button>
            <button
              onClick={() => setActiveCodeTab('service')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all ${
                activeCodeTab === 'service' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              @Service (Bakiye Doğrulama)
            </button>
            <button
              onClick={() => setActiveCodeTab('controller')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all ${
                activeCodeTab === 'controller' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              @RestController (Swagger)
            </button>
            <button
              onClick={() => setActiveCodeTab('security')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all ${
                activeCodeTab === 'security' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Spring Security (BCrypt)
            </button>
          </div>

          <button
            onClick={() => copyCode(codeSnippets[activeCodeTab])}
            className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg transition-colors font-mono"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Kopyalandı!' : 'Kodu Kopyala'}</span>
          </button>
        </div>

        {/* Kod Alanı */}
        <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-slate-300 overflow-x-auto font-mono text-xs leading-relaxed max-h-[500px]">
          {codeSnippets[activeCodeTab]}
        </pre>
      </div>
    </div>
  );
};
