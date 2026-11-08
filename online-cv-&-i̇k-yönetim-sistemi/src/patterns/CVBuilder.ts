/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Online CV & İK Yönetim Sistemi
 * Geliştirici: Enes Öztürk
 * Design Pattern: Builder Pattern (CV Oluşturucu)
 * S.O.L.I.D: Single Responsibility & Open/Closed Prensipleri
 */

import { CandidateCVEntity, IExperience, IEducation } from '../types/models';
import { MilitaryStatus, ApplicationStatus } from '../types/enums';

export class CVBuilder {
  private id?: string;
  private userId: string = '';
  private firstName: string = '';
  private lastName: string = '';
  private phone: string = '';
  private email: string = '';
  private city: string = 'İstanbul';
  private title: string = '';
  private summary: string = '';
  private totalExperienceYears: number = 0;
  private militaryStatus: MilitaryStatus = MilitaryStatus.DONE;
  private kvkkConsentGiven: boolean = true;
  private kvkkExpiryDate: string = '';
  private applicationStatus: ApplicationStatus = ApplicationStatus.NEW;
  private experiences: IExperience[] = [];
  private educations: IEducation[] = [];
  private skills: string[] = [];
  private languages: string[] = [];
  private hrNotes: string | null = null;

  constructor(userId?: string) {
    if (userId) {
      this.userId = userId;
    }
    // Varsayılan olarak 1 yıl sonraki KVKK süresi
    const oneYearLater = new Date();
    oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
    this.kvkkExpiryDate = oneYearLater.toISOString().split('T')[0];
  }

  public setId(id: string): CVBuilder {
    this.id = id;
    return this;
  }

  public setUserId(userId: string): CVBuilder {
    this.userId = userId;
    return this;
  }

  public setPersonalDetails(firstName: string, lastName: string, email: string, phone: string, city: string): CVBuilder {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phone = phone;
    this.city = city;
    return this;
  }

  public setProfessionalTitle(title: string, summary: string): CVBuilder {
    this.title = title;
    this.summary = summary;
    return this;
  }

  public setExperienceYears(years: number): CVBuilder {
    this.totalExperienceYears = Math.max(0, years);
    return this;
  }

  public setMilitaryStatus(status: MilitaryStatus): CVBuilder {
    this.militaryStatus = status;
    return this;
  }

  public setKvkkConsent(consent: boolean, expiryDate: string): CVBuilder {
    this.kvkkConsentGiven = consent;
    this.kvkkExpiryDate = expiryDate;
    return this;
  }

  public setApplicationStatus(status: ApplicationStatus): CVBuilder {
    this.applicationStatus = status;
    return this;
  }

  public addExperience(exp: IExperience): CVBuilder {
    this.experiences.push(exp);
    return this;
  }

  public setExperiences(experiences: IExperience[]): CVBuilder {
    this.experiences = [...experiences];
    // Otomatik toplam yıl hesaplama
    const calculated = experiences.reduce((sum, e) => sum + (e.years || 0), 0);
    if (calculated > 0 && this.totalExperienceYears === 0) {
      this.totalExperienceYears = calculated;
    }
    return this;
  }

  public addEducation(edu: IEducation): CVBuilder {
    this.educations.push(edu);
    return this;
  }

  public setEducations(educations: IEducation[]): CVBuilder {
    this.educations = [...educations];
    return this;
  }

  public setSkills(skills: string[]): CVBuilder {
    this.skills = [...skills];
    return this;
  }

  public setLanguages(languages: string[]): CVBuilder {
    this.languages = [...languages];
    return this;
  }

  public setHrNotes(notes: string | null): CVBuilder {
    this.hrNotes = notes;
    return this;
  }

  public build(): CandidateCVEntity {
    if (!this.userId) {
      throw new Error('CVBuilder Hatası: userId zorunludur!');
    }
    if (!this.firstName || !this.lastName) {
      throw new Error('CVBuilder Hatası: Ad ve Soyad zorunludur!');
    }

    return new CandidateCVEntity({
      id: this.id,
      userId: this.userId,
      firstName: this.firstName,
      lastName: this.lastName,
      phone: this.phone,
      email: this.email,
      city: this.city,
      title: this.title,
      summary: this.summary,
      totalExperienceYears: this.totalExperienceYears,
      militaryStatus: this.militaryStatus,
      kvkkConsentGiven: this.kvkkConsentGiven,
      kvkkExpiryDate: this.kvkkExpiryDate,
      applicationStatus: this.applicationStatus,
      experiences: this.experiences,
      educations: this.educations,
      skills: this.skills,
      languages: this.languages,
      hrNotes: this.hrNotes,
    });
  }
}
