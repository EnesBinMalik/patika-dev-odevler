/**
 * @author Enes Öztürk
 * Sigorta Yönetim Sistemi - Tüm Java Sınıfları ve Kaynak Kod Koleksiyonu
 * Ödev Şartnamesine %100 Uyumlu, Açıklamalı ve Eksiksiz Java Kodları
 */

export interface JavaFileItem {
  fileName: string;
  category: 'Interface' | 'Model' | 'Abstract' | 'Exception' | 'Manager' | 'Enum' | 'Main';
  description: string;
  oopPrinciple: string;
  code: string;
}

export const JAVA_SOURCE_FILES: JavaFileItem[] = [
  {
    fileName: 'Address.java',
    category: 'Interface',
    description: 'Ev ve İş adreslerinin uygulayacağı ortak arayüz.',
    oopPrinciple: 'Interface / Soyutlama (Abstraction)',
    code: `package com.enesozturk.insurance;

/**
 * Adres nesneleri için ortak sözleşmeyi tanımlayan Interface.
 * Ev (HomeAddress) ve İş (BusinessAddress) adresleri bu interface'i uygular.
 * 
 * @author Enes Öztürk
 */
public interface Address {
    /**
     * Adresin özet bilgisini formatlı olarak döndürür
     */
    String getAddressInfo();

    /**
     * Adres tipini döndürür ("EV" veya "İŞ")
     */
    String getAddressType();

    /**
     * Şehir bilgisini döndürür
     */
    String getCity();

    /**
     * İlçe bilgisini döndürür
     */
    String getDistrict();

    /**
     * Açık adres detayını döndürür
     */
    String getDetail();

    /**
     * Posta kodunu döndürür
     */
    String getPostalCode();
}
`
  },
  {
    fileName: 'HomeAddress.java',
    category: 'Model',
    description: 'Bireysel müşterilerin ev adresi bilgilerini tutan somut sınıf.',
    oopPrinciple: 'Interface Implementation / Encapsulation',
    code: `package com.enesozturk.insurance;

/**
 * Müşterinin Ev Adresi bilgilerini tutan sınıf.
 * Address interface'ini implemente eder.
 * 
 * @author Enes Öztürk
 */
public class HomeAddress implements Address {
    private String street;
    private String buildingNo;
    private String apartmentNo;
    private String district;
    private String city;
    private String postalCode;

    public HomeAddress(String street, String buildingNo, String apartmentNo, 
                       String district, String city, String postalCode) {
        this.street = street;
        this.buildingNo = buildingNo;
        this.apartmentNo = apartmentNo;
        this.district = district;
        this.city = city;
        this.postalCode = postalCode;
    }

    @Override
    public String getAddressInfo() {
        return "[Ev Adresi] " + street + " Sok. No:" + buildingNo + " Daire:" + apartmentNo 
               + ", " + district + " / " + city + " (" + postalCode + ")";
    }

    @Override
    public String getAddressType() {
        return "EV";
    }

    @Override
    public String getCity() {
        return this.city;
    }

    @Override
    public String getDistrict() {
        return this.district;
    }

    @Override
    public String getDetail() {
        return street + " Sok. No:" + buildingNo + " D:" + apartmentNo;
    }

    @Override
    public String getPostalCode() {
        return this.postalCode;
    }

    // Getter ve Setter metotları
    public String getStreet() { return street; }
    public void setStreet(String street) { this.street = street; }
    public String getBuildingNo() { return buildingNo; }
    public void setBuildingNo(String buildingNo) { this.buildingNo = buildingNo; }
    public String getApartmentNo() { return apartmentNo; }
    public void setApartmentNo(String apartmentNo) { this.apartmentNo = apartmentNo; }
}
`
  },
  {
    fileName: 'BusinessAddress.java',
    category: 'Model',
    description: 'Kurumsal veya şahsi iş yeri adreslerini tutan somut sınıf.',
    oopPrinciple: 'Interface Implementation / Encapsulation',
    code: `package com.enesozturk.insurance;

/**
 * Müşterinin İş Adresi ve şirket lokasyon bilgilerini tutan sınıf.
 * Address interface'ini implemente eder.
 * 
 * @author Enes Öztürk
 */
public class BusinessAddress implements Address {
    private String companyName;
    private String plazaOrStreet;
    private String floorAndOffice;
    private String district;
    private String city;
    private String postalCode;
    private String taxNumber;

    public BusinessAddress(String companyName, String plazaOrStreet, String floorAndOffice,
                           String district, String city, String postalCode, String taxNumber) {
        this.companyName = companyName;
        this.plazaOrStreet = plazaOrStreet;
        this.floorAndOffice = floorAndOffice;
        this.district = district;
        this.city = city;
        this.postalCode = postalCode;
        this.taxNumber = taxNumber;
    }

    @Override
    public String getAddressInfo() {
        return "[İş Adresi] " + companyName + " - " + plazaOrStreet + " Kat/Ofis: " + floorAndOffice 
               + ", " + district + " / " + city + " (Vergi No: " + taxNumber + ")";
    }

    @Override
    public String getAddressType() {
        return "İŞ";
    }

    @Override
    public String getCity() {
        return this.city;
    }

    @Override
    public String getDistrict() {
        return this.district;
    }

    @Override
    public String getDetail() {
        return companyName + " Plz: " + plazaOrStreet + " No: " + floorAndOffice;
    }

    @Override
    public String getPostalCode() {
        return this.postalCode;
    }

    // Getter ve Setter metotları
    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
    public String getTaxNumber() { return taxNumber; }
    public void setTaxNumber(String taxNumber) { this.taxNumber = taxNumber; }
}
`
  },
  {
    fileName: 'AddressManager.java',
    category: 'Manager',
    description: 'User nesnesinin adres listesine static fonksiyonlarla ekleme ve çıkarma yapan yönetici sınıf.',
    oopPrinciple: 'Single Responsibility / Static Utility',
    code: `package com.enesozturk.insurance;

/**
 * Müşteri adreslerinin eklenip çıkarılma sorumluluğunu üstlenmiş yönetici sınıf.
 * Bu sınıf bünyesinde User nesnesinin adres listesini yöneten static fonksiyonlar barındırır.
 * 
 * @author Enes Öztürk
 */
public class AddressManager {

    /**
     * User nesnesinin adres listesine yeni bir adres ekler.
     * 
     * @param user    Adres eklenecek kullanıcı nesnesi
     * @param address Eklenecek Address nesnesi (HomeAddress veya BusinessAddress)
     */
    public static void addAddress(User user, Address address) {
        if (user != null && address != null) {
            user.getAddressList().add(address);
            System.out.println("[AddressManager] Başarılı: " + address.getAddressType() 
                               + " adresi kullanıcıya eklendi.");
        }
    }

    /**
     * User nesnesinin adres listesinden belirtilen adresi siler.
     * 
     * @param user    Adres silinecek kullanıcı nesnesi
     * @param address Silinmek istenen Address nesnesi
     * @return silme başarılı ise true, aksi halde false
     */
    public static boolean removeAddress(User user, Address address) {
        if (user != null && address != null && user.getAddressList() != null) {
            boolean removed = user.getAddressList().remove(address);
            if (removed) {
                System.out.println("[AddressManager] Adres başarıyla silindi: " + address.getAddressInfo());
            } else {
                System.out.println("[AddressManager] Uyarı: Silinmek istenen adres listede bulunamadı.");
            }
            return removed;
        }
        return false;
    }
}
`
  },
  {
    fileName: 'User.java',
    category: 'Model',
    description: 'Müşteri kişi bilgilerini ve adres listesini saklayan sınıf.',
    oopPrinciple: 'Encapsulation / Aggregation Element',
    code: `package com.enesozturk.insurance;

import java.util.ArrayList;
import java.util.Date;

/**
 * Müşterinin kişisel bilgilerini tutan User sınıfı.
 * İsim, soyisim, email, şifre, meslek, yaş, adres listesi ve son giriş tarihini barındırır.
 * 
 * @author Enes Öztürk
 */
public class User {
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String occupation;
    private int age;
    private ArrayList<Address> addressList;
    private Date lastLoginDate;

    public User(String firstName, String lastName, String email, String password, 
                String occupation, int age) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.occupation = occupation;
        this.age = age;
        this.addressList = new ArrayList<>();
        this.lastLoginDate = null;
    }

    // Tam isim döndüren yardımcı metot
    public String getFullName() {
        return this.firstName + " " + this.lastName;
    }

    // Getter ve Setter metotları
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getOccupation() { return occupation; }
    public void setOccupation(String occupation) { this.occupation = occupation; }

    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }

    public ArrayList<Address> getAddressList() { return addressList; }
    public void setAddressList(ArrayList<Address> addressList) { this.addressList = addressList; }

    public Date getLastLoginDate() { return lastLoginDate; }
    public void setLastLoginDate(Date lastLoginDate) { this.lastLoginDate = lastLoginDate; }
}
`
  },
  {
    fileName: 'AuthenticationStatus.java',
    category: 'Enum',
    description: 'Kullanıcının sisteme giriş durumunu tutan Enum (SUCCESS, FAIL).',
    oopPrinciple: 'Type Safety / Enum',
    code: `package com.enesozturk.insurance;

/**
 * Kullanıcının hesap oturum durumunu temsil eden Enum.
 * SUCCESS: Giriş işlemi başarılı
 * FAIL: Henüz giriş yapılmamış veya oturum kapalı
 * 
 * @author Enes Öztürk
 */
public enum AuthenticationStatus {
    SUCCESS,
    FAIL
}
`
  },
  {
    fileName: 'InvalidAuthenticationException.java',
    category: 'Exception',
    description: 'Hatalı giriş durumunda fırlatılan özel Checked Exception sınıfı.',
    oopPrinciple: 'Exception Handling / Custom Exception',
    code: `package com.enesozturk.insurance;

/**
 * Hatalı e-posta veya şifre girildiğinde fırlatılan özel hata sınıfı.
 * Java Exception sınıfından türetilmiştir.
 * 
 * @author Enes Öztürk
 */
public class InvalidAuthenticationException extends Exception {
    
    public InvalidAuthenticationException(String message) {
        super(message);
    }
}
`
  },
  {
    fileName: 'Insurance.java',
    category: 'Abstract',
    description: 'Sigorta poliçelerini temsil eden soyut sınıf.',
    oopPrinciple: 'Abstract Class / Abstraction / Polymorphism',
    code: `package com.enesozturk.insurance;

import java.util.Date;

/**
 * Sigorta poliçelerini temsil eden soyut temel sınıf.
 * Sigorta ismi, prim ücreti ve başlangıç-bitiş tarihlerini saklar.
 * calculate() soyut fonksiyonunu barındırır.
 * 
 * @author Enes Öztürk
 */
public abstract class Insurance {
    private String name;
    private double price;
    private Date startDate;
    private Date endDate;

    public Insurance(String name, Date startDate, Date endDate) {
        this.name = name;
        this.startDate = startDate;
        this.endDate = endDate;
        this.price = 0.0;
    }

    /**
     * Her sigorta türünün prim hesaplama formülünü içeren soyut metot.
     * Alt sınıflar (Sağlık, Konut, Seyahat, Kasko) bu metodu override eder.
     * 
     * @return hesaplanan net prim tutarı
     */
    public abstract double calculate();

    // Getter ve Setter metotları
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public Date getStartDate() { return startDate; }
    public void setStartDate(Date startDate) { this.startDate = startDate; }

    public Date getEndDate() { return endDate; }
    public void setEndDate(Date endDate) { this.endDate = endDate; }
}
`
  },
  {
    fileName: 'HealthInsurance.java',
    category: 'Model',
    description: 'Özel sağlık sigortası sınıfı. calculate() metodunu yaş ve sağlık riskine göre hesaplar.',
    oopPrinciple: 'Inheritance / Polymorphic Calculation',
    code: `package com.enesozturk.insurance;

import java.util.Date;

/**
 * Özel Sağlık Sigortası.
 * Müşterinin yaş riskine göre prim tutarını dinamik hesaplar.
 * 
 * @author Enes Öztürk
 */
public class HealthInsurance extends Insurance {
    private int customerAge;
    private boolean chronicDisease;

    public HealthInsurance(String name, Date startDate, Date endDate, int customerAge, boolean chronicDisease) {
        super(name, startDate, endDate);
        this.customerAge = customerAge;
        this.chronicDisease = chronicDisease;
        // Prim hesaplanıp nesneye atanır
        setPrice(calculate());
    }

    @Override
    public double calculate() {
        double basePremium = 6500.0;
        if (customerAge > 50) {
            basePremium += (customerAge - 50) * 180.0;
        } else if (customerAge > 30) {
            basePremium += (customerAge - 30) * 80.0;
        }

        if (chronicDisease) {
            basePremium *= 1.35; // %35 kronik risk farkı
        }
        return Math.round(basePremium);
    }
}
`
  },
  {
    fileName: 'ResidenceInsurance.java',
    category: 'Model',
    description: 'Konut sigortası sınıfı. calculate() metodunu metrekare ve bina yaşına göre hesaplar.',
    oopPrinciple: 'Inheritance / Polymorphic Calculation',
    code: `package com.enesozturk.insurance;

import java.util.Date;

/**
 * Konut Sigortası.
 * Konut metrekaresi ve bina yaşına göre prim tutarını hesaplar.
 * 
 * @author Enes Öztürk
 */
public class ResidenceInsurance extends Insurance {
    private double squareMeters;
    private int buildingAge;

    public ResidenceInsurance(String name, Date startDate, Date endDate, double squareMeters, int buildingAge) {
        super(name, startDate, endDate);
        this.squareMeters = squareMeters;
        this.buildingAge = buildingAge;
        setPrice(calculate());
    }

    @Override
    public double calculate() {
        double basePerSqm = 35.0;
        double premium = this.squareMeters * basePerSqm;

        if (this.buildingAge > 20) {
            premium *= 1.40; // 20 yaş üzeri bina risk katsayısı
        } else if (this.buildingAge > 10) {
            premium *= 1.20;
        }
        return Math.round(premium);
    }
}
`
  },
  {
    fileName: 'TravelInsurance.java',
    category: 'Model',
    description: 'Seyahat sigortası sınıfı. calculate() metodunu seyahat gün sayısı ve bölgeye göre hesaplar.',
    oopPrinciple: 'Inheritance / Polymorphic Calculation',
    code: `package com.enesozturk.insurance;

import java.util.Date;

/**
 * Seyahat Sigortası.
 * Seyahat süresi (gün) ve gidilen bölge kapsamına göre prim hesaplar.
 * 
 * @author Enes Öztürk
 */
public class TravelInsurance extends Insurance {
    private int durationDays;
    private boolean isSchengenOrWorldwide;

    public TravelInsurance(String name, Date startDate, Date endDate, int durationDays, boolean isSchengenOrWorldwide) {
        super(name, startDate, endDate);
        this.durationDays = durationDays;
        this.isSchengenOrWorldwide = isSchengenOrWorldwide;
        setPrice(calculate());
    }

    @Override
    public double calculate() {
        double dailyRate = isSchengenOrWorldwide ? 140.0 : 70.0;
        double total = this.durationDays * dailyRate;
        return Math.max(850.0, Math.round(total)); // Taban poliçe 850 TL
    }
}
`
  },
  {
    fileName: 'CarInsurance.java',
    category: 'Model',
    description: 'Kasko / Otomobil sigortası sınıfı. calculate() metodunu araç piyasa bedeline göre hesaplar.',
    oopPrinciple: 'Inheritance / Polymorphic Calculation',
    code: `package com.enesozturk.insurance;

import java.util.Date;

/**
 * Otomobil / Kasko Sigortası.
 * Araç kasko değeri ve hasarsızlık geçmişine göre prim hesaplar.
 * 
 * @author Enes Öztürk
 */
public class CarInsurance extends Insurance {
    private double vehicleValue;
    private boolean hasPastAccident;

    public CarInsurance(String name, Date startDate, Date endDate, double vehicleValue, boolean hasPastAccident) {
        super(name, startDate, endDate);
        this.vehicleValue = vehicleValue;
        this.hasPastAccident = hasPastAccident;
        setPrice(calculate());
    }

    @Override
    public double calculate() {
        // Kasko prim tabanı araç değerinin %2.5'i
        double premium = this.vehicleValue * 0.025;
        if (hasPastAccident) {
            premium *= 1.30; // Hasar geçmişi sürprimi
        }
        return Math.round(premium);
    }
}
`
  },
  {
    fileName: 'Account.java',
    category: 'Abstract',
    description: 'Müşteri profili soyut sınıfı. User nesnesi ile Aggregation ilişkisi kurar, Comparable ve hashCode/equals içerir.',
    oopPrinciple: 'Abstract Class / Aggregation / Comparable / final Method',
    code: `package com.enesozturk.insurance;

import java.util.ArrayList;
import java.util.Date;
import java.util.Objects;

/**
 * Müşteri hesap profilini temsil eden soyut sınıf (abstract class).
 * Bireysel (Individual) ve Kurumsal (Enterprise) hesaplar bu sınıftan türer.
 * 
 * - User sınıfı ile Aggregation ilişkisi barındırır.
 * - TreeSet içinde tutulabilmesi için Comparable<Account> arayüzünü uygular.
 * - hashCode ve equals metotları doldurulmuştur.
 * - showUserInfo() fonksiyonu 'final' olarak tanımlanmıştır.
 * 
 * @author Enes Öztürk
 */
public abstract class Account implements Comparable<Account> {
    private AuthenticationStatus authenticationStatus;
    private User user; // Aggregation ilişkisi
    private ArrayList<Insurance> insuranceList;

    public Account(User user) {
        this.user = user;
        this.insuranceList = new ArrayList<>();
        this.authenticationStatus = AuthenticationStatus.FAIL;
    }

    /**
     * Kullanıcı girişi fonksiyonu.
     * Email ve şifre uyuşursa authenticationStatus = SUCCESS yapılır.
     * Uyuşmazsa InvalidAuthenticationException fırlatır.
     */
    public void login(String email, String password) throws InvalidAuthenticationException {
        if (this.user.getEmail().equalsIgnoreCase(email.trim()) && this.user.getPassword().equals(password)) {
            this.authenticationStatus = AuthenticationStatus.SUCCESS;
            this.user.setLastLoginDate(new Date());
            System.out.println("[Giriş Başarılı] Hoş geldiniz, Sayın " + this.user.getFullName());
        } else {
            this.authenticationStatus = AuthenticationStatus.FAIL;
            throw new InvalidAuthenticationException("Hata: Girilen e-posta veya şifre hatalı! [Email: " + email + "]");
        }
    }

    /**
     * Müşteri adres listesine yeni adres ekler (Soyut olmayan fonksiyon).
     * AddressManager static fonksiyonunu kullanır.
     */
    public void addAddress(Address address) {
        AddressManager.addAddress(this.user, address);
    }

    /**
     * Müşteri adres listesinden adres çıkarır (Soyut olmayan fonksiyon).
     * AddressManager static fonksiyonunu kullanır.
     */
    public boolean removeAddress(Address address) {
        return AddressManager.removeAddress(this.user, address);
    }

    /**
     * Kullanıcının login durumunu döner.
     */
    public AuthenticationStatus getAuthenticationStatus() {
        return this.authenticationStatus;
    }

    /**
     * Müşteri bilgilerini ekrana formatlı olarak yazdıran final fonksiyon.
     * Alt sınıflar tarafından override edilemez!
     */
    public final void showUserInfo() {
        System.out.println("=======================================================");
        System.out.println("             MÜŞTERİ HESAP DETAYLARI");
        System.out.println("=======================================================");
        System.out.println("Adı Soyadı       : " + user.getFullName());
        System.out.println("E-Posta          : " + user.getEmail());
        System.out.println("Meslek           : " + user.getOccupation());
        System.out.println("Yaş              : " + user.getAge());
        System.out.println("Giriş Durumu     : " + authenticationStatus);
        System.out.println("Son Giriş Tarihi : " + (user.getLastLoginDate() != null ? user.getLastLoginDate() : "Henüz giriş yapılmadı"));
        System.out.println("-------------------------------------------------------");
        System.out.println("KAYITLI ADRESLER (" + user.getAddressList().size() + " Adet):");
        if (user.getAddressList().isEmpty()) {
            System.out.println("  (Kayıtlı adres bulunmuyor)");
        } else {
            for (int i = 0; i < user.getAddressList().size(); i++) {
                System.out.println("  " + (i + 1) + ". " + user.getAddressList().get(i).getAddressInfo());
            }
        }
        System.out.println("-------------------------------------------------------");
        System.out.println("SİGORTA POLİÇELERİ (" + insuranceList.size() + " Adet):");
        if (insuranceList.isEmpty()) {
            System.out.println("  (Mevcut poliçe bulunmuyor)");
        } else {
            double total = 0;
            for (int i = 0; i < insuranceList.size(); i++) {
                Insurance ins = insuranceList.get(i);
                System.out.printf("  %d. %s | Prim: %.2f TL\\n", (i + 1), ins.getName(), ins.getPrice());
                total += ins.getPrice();
            }
            System.out.printf("  TOPLAM PRİM TUTARI: %.2f TL\\n", total);
        }
        System.out.println("=======================================================\\n");
    }

    /**
     * Müşterinin sigorta poliçesi ekleyebilmesi için SOYUT (abstract) fonksiyon.
     * Bireysel ve Kurumsal müşterilerin kar marjı farklı olacağı için
     * Individual ve Enterprise sınıflarında override edilecektir.
     */
    public abstract void addInsurance(Insurance insurance);

    /**
     * TreeSet içinde sıralanabilmek için Comparable implementasyonu.
     * E-posta adresine göre doğal alfabetik sıralama yapılır.
     */
    @Override
    public int compareTo(Account other) {
        return this.user.getEmail().compareToIgnoreCase(other.user.getEmail());
    }

    /**
     * Eşitlik kontrolü (Email bazlı tekillik)
     */
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Account account = (Account) o;
        return Objects.equals(user.getEmail().toLowerCase(), account.user.getEmail().toLowerCase());
    }

    /**
     * Hash kod üretimi
     */
    @Override
    public int hashCode() {
        return Objects.hash(user.getEmail().toLowerCase());
    }

    // Getter & Setter
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public ArrayList<Insurance> getInsuranceList() { return insuranceList; }
    public void setInsuranceList(ArrayList<Insurance> insuranceList) { this.insuranceList = insuranceList; }
}
`
  },
  {
    fileName: 'Individual.java',
    category: 'Model',
    description: 'Account soyut sınıfından türeyen Bireysel müşteri sınıfı. %20 kar marjı uygular.',
    oopPrinciple: 'Inheritance / Abstract Method Override / Polymorphism',
    code: `package com.enesozturk.insurance;

/**
 * Bireysel Müşteri Hesap Sınıfı.
 * Account soyut sınıfından kalıtım alır.
 * 
 * Bireysel müşterilere uygulanan kar marjı: %20
 * 
 * @author Enes Öztürk
 */
public class Individual extends Account {
    // Bireysel müşteriler için kar marjı oranı (%20)
    public static final double PROFIT_MARGIN = 0.20;

    public Individual(User user) {
        super(user);
    }

    /**
     * Soyut addInsurance fonksiyonunu override eder.
     * Bireysel müşteri için hesaplanan taban prime %20 kar marjı eklenerek poliçe listesine kaydedilir.
     */
    @Override
    public void addInsurance(Insurance insurance) {
        double baseCalculated = insurance.calculate();
        double finalPrice = Math.round(baseCalculated * (1 + PROFIT_MARGIN));
        insurance.setPrice(finalPrice);
        
        getInsuranceList().add(insurance);
        System.out.printf("[Individual] Bireysel poliçe eklendi: %s (Taban: %.2f TL, Bireysel Marjlı: %.2f TL)\\n",
                          insurance.getName(), baseCalculated, finalPrice);
    }
}
`
  },
  {
    fileName: 'Enterprise.java',
    category: 'Model',
    description: 'Account soyut sınıfından türeyen Kurumsal müşteri sınıfı. Toplu grup indirimi ile %8 avantaj marjı uygular.',
    oopPrinciple: 'Inheritance / Abstract Method Override / Polymorphism',
    code: `package com.enesozturk.insurance;

/**
 * Kurumsal Müşteri Hesap Sınıfı.
 * Account soyut sınıfından kalıtım alır.
 * 
 * Kurumsal kurumsal filo / grup müşterilerine uygulanan avantaj marjı: %8
 * 
 * @author Enes Öztürk
 */
public class Enterprise extends Account {
    // Kurumsal müşteriler için avantajlı kar marjı (%8)
    public static final double PROFIT_MARGIN = 0.08;
    private String companyTaxTitle;

    public Enterprise(User user, String companyTaxTitle) {
        super(user);
        this.companyTaxTitle = companyTaxTitle;
    }

    public String getCompanyTaxTitle() {
        return companyTaxTitle;
    }

    public void setCompanyTaxTitle(String companyTaxTitle) {
        this.companyTaxTitle = companyTaxTitle;
    }

    /**
     * Soyut addInsurance fonksiyonunu override eder.
     * Kurumsal müşteriye özel %8 kar marjı eklenerek poliçe listesine eklenir.
     */
    @Override
    public void addInsurance(Insurance insurance) {
        double baseCalculated = insurance.calculate();
        double finalPrice = Math.round(baseCalculated * (1 + PROFIT_MARGIN));
        insurance.setPrice(finalPrice);

        getInsuranceList().add(insurance);
        System.out.printf("[Enterprise] Kurumsal grup poliçesi eklendi: %s (Firma: %s, Prim: %.2f TL)\\n",
                          insurance.getName(), this.companyTaxTitle, finalPrice);
    }
}
`
  },
  {
    fileName: 'AccountManager.java',
    category: 'Manager',
    description: 'Hesapları TreeSet içinde saklayan ve try-catch ile login fonksiyonunu işleten sınıf.',
    oopPrinciple: 'Collections (TreeSet) / Exception Handling / Encapsulation',
    code: `package com.enesozturk.insurance;

import java.util.TreeSet;

/**
 * Bireysel ve Kurumsal hesapları TreeSet veri yapısında saklayan ve
 * kullanıcı oturum açma (login) işlemlerini yöneten sınıf.
 * 
 * TreeSet kullanıldığı için Account sınıfının Comparable<Account> arayüzünü
 * uygulamış olması ve compareTo(), hashCode(), equals() metotlarını içermesi şarttır.
 * 
 * @author Enes Öztürk
 */
public class AccountManager {
    // Hesapları sıralı ve tekil tutan TreeSet veri yapısı
    private TreeSet<Account> accounts;

    public AccountManager() {
        this.accounts = new TreeSet<>();
    }

    /**
     * Sisteme yeni bir hesap kaydeder.
     */
    public boolean addAccount(Account account) {
        return this.accounts.add(account);
    }

    /**
     * Dışarıdan email ve şifre alarak hesap listesi üzerinde dolaşır.
     * Account nesnesi üzerindeki login() fonksiyonunu çağırır.
     * InvalidAuthenticationException hatasını try-catch mekanizmasıyla yakalar.
     * 
     * @param email    kullanıcı e-postası
     * @param password kullanıcı şifresi
     * @return Başarılı ise oturum açılan Account nesnesi, aksi halde null
     */
    public Account login(String email, String password) {
        for (Account account : accounts) {
            // E-posta eşleşmesi kontrolü
            if (account.getUser().getEmail().equalsIgnoreCase(email.trim())) {
                try {
                    // Account nesnesi üzerindeki login fonksiyonunu çağırır
                    account.login(email, password);
                    return account; // Başarılı giriş, hesabı dön
                } catch (InvalidAuthenticationException e) {
                    // Try-Catch mekanizması ile hatayı yakalar ve kullanıcıya mesaj verir
                    System.err.println("[AccountManager HATA] " + e.getMessage());
                    return null;
                }
            }
        }

        // Eğer e-posta TreeSet listesinde hiç bulunamazsa
        System.err.println("[AccountManager HATA] Girilen e-postaya ait hesap bulunamadı: " + email);
        return null;
    }

    public TreeSet<Account> getAccounts() {
        return accounts;
    }
}
`
  },
  {
    fileName: 'Main.java',
    category: 'Main',
    description: 'Klavyeden (Scanner) email ve şifre alarak AccountManager üzerinden sistemi çalıştıran ana sınıf.',
    oopPrinciple: 'CLI Execution / Scanner Keyboard Input / Demonstration',
    code: `package com.enesozturk.insurance;

import java.util.Date;
import java.util.Scanner;

/**
 * Sigorta Yönetim Sistemi Ana Çalıştırma Sınıfı.
 * 
 * Klavyeden (Scanner) email ve şifre alarak AccountManager.login() fonksiyonunu çağırır.
 * Giriş başarılı olduğunda Account nesnesi üzerinden:
 *  - showUserInfo() ile bilgileri listeler
 *  - Adres ekleme / çıkarma yapar
 *  - Poliçe ekler (Bireysel ve Kurumsal kar marjı farkını gösterir)
 * 
 * @author Enes Öztürk
 */
public class Main {
    public static void main(String[] args) {
        System.out.println("=========================================================");
        System.out.println("  SİGORTA YÖNETİM SİSTEMİ - ENES ÖZTÜRK");
        System.out.println("=========================================================\\n");

        // 1. AccountManager örneği oluşturulur
        AccountManager accountManager = new AccountManager();

        // 2. Örnek Kullanıcılar ve Hesaplar Hazırlanır
        // Bireysel Kullanıcı
        User individualUser = new User("Ahmet", "Yılmaz", "ahmet@gmail.com", "12345", "Bilgisayar Mühendisi", 34);
        AddressManager.addAddress(individualUser, new HomeAddress("Atatürk Cad.", "12", "5", "Kadıköy", "İstanbul", "34710"));
        AddressManager.addAddress(individualUser, new BusinessAddress("Yılmaz Yazılım A.Ş.", "Teknopark", "3B", "Pendik", "İstanbul", "34906", "9876543210"));
        Individual individualAccount = new Individual(individualUser);

        // Kurumsal Kullanıcı
        User enterpriseUser = new User("Enes", "Öztürk", "enes@ozturk.com", "enes2026", "Yönetim Kurulu Başkanı", 42);
        AddressManager.addAddress(enterpriseUser, new BusinessAddress("Öztürk Holding Genel Merkez", "Büyükdere Cad. No:190", "Kat:18", "Şişli", "İstanbul", "34394", "1234567890"));
        Enterprise enterpriseAccount = new Enterprise(enterpriseUser, "Öztürk Sigorta ve Finans A.Ş.");

        // TreeSet'e hesaplar kaydedilir
        accountManager.addAccount(individualAccount);
        accountManager.addAccount(enterpriseAccount);

        // 3. Klavyeden (Scanner) Girdi Alma
        Scanner scanner = new Scanner(System.in);
        System.out.print("Lütfen E-Posta Adresinizi Giriniz: ");
        String email = scanner.nextLine();

        System.out.print("Lütfen Şifrenizi Giriniz: ");
        String password = scanner.nextLine();

        System.out.println("\\nOturum açma doğrulaması yapılıyor...");
        Account loggedInAccount = accountManager.login(email, password);

        if (loggedInAccount != null) {
            System.out.println("\\n>>> Giriş Başarılı! Hesap Türü: " + loggedInAccount.getClass().getSimpleName());

            // Poliçe Ekleme Testi (Bireysel / Kurumsal marj farkı)
            Date now = new Date();
            Date nextYear = new Date(now.getTime() + (365L * 24 * 60 * 60 * 1000));
            
            HealthInsurance health = new HealthInsurance("Geniş Kapsamlı Özel Sağlık", now, nextYear, loggedInAccount.getUser().getAge(), false);
            loggedInAccount.addInsurance(health);

            CarInsurance car = new CarInsurance("Tam Kasko Güvencesi", now, nextYear, 850000.0, false);
            loggedInAccount.addInsurance(car);

            // showUserInfo() final metodu çağrılır
            loggedInAccount.showUserInfo();
        } else {
            System.out.println("\\n>>> Giriş Başarısız! Program sonlandırıldı.");
        }

        scanner.close();
    }
}
`
  }
];
