/**
 * @license
 * Enes Öztürk - KariyerPortalı
 * Entity: Company (JPA @Entity @Table(name = "companies"))
 * Relation: Company (1) -> (N) JobPosting (@OneToMany)
 */

import { BaseEntity } from './BaseEntity.ts';

export class Company extends BaseEntity {
  private name: string;
  private industry: string;
  private taxNumber: string;
  private website: string;
  private city: string;
  private address: string;
  private employeeCount: string;
  private description: string;
  private adminUserId: string; // Foreign key back to User (ADMIN)

  constructor(params: {
    id?: string;
    name: string;
    industry: string;
    taxNumber: string;
    website?: string;
    city: string;
    address?: string;
    employeeCount?: string;
    description?: string;
    adminUserId: string;
    createdAt?: string;
    updatedAt?: string;
    version?: number;
  }) {
    super(params.id, params.createdAt, params.updatedAt, params.version);
    this.name = params.name.trim();
    this.industry = params.industry.trim();
    this.taxNumber = params.taxNumber.trim();
    this.website = params.website || '';
    this.city = params.city.trim();
    this.address = params.address || '';
    this.employeeCount = params.employeeCount || '50-100';
    this.description = params.description || '';
    this.adminUserId = params.adminUserId;
  }

  // Getters
  public getName(): string { return this.name; }
  public getIndustry(): string { return this.industry; }
  public getTaxNumber(): string { return this.taxNumber; }
  public getWebsite(): string { return this.website; }
  public getCity(): string { return this.city; }
  public getAddress(): string { return this.address; }
  public getEmployeeCount(): string { return this.employeeCount; }
  public getDescription(): string { return this.description; }
  public getAdminUserId(): string { return this.adminUserId; }

  // Setters
  public updateDetails(details: {
    name?: string;
    industry?: string;
    website?: string;
    city?: string;
    address?: string;
    employeeCount?: string;
    description?: string;
  }): void {
    if (details.name) this.name = details.name.trim();
    if (details.industry) this.industry = details.industry.trim();
    if (details.website !== undefined) this.website = details.website.trim();
    if (details.city) this.city = details.city.trim();
    if (details.address !== undefined) this.address = details.address.trim();
    if (details.employeeCount) this.employeeCount = details.employeeCount;
    if (details.description !== undefined) this.description = details.description.trim();
    this.updateTimestamp();
  }

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      industry: this.industry,
      taxNumber: this.taxNumber,
      website: this.website,
      city: this.city,
      address: this.address,
      employeeCount: this.employeeCount,
      description: this.description,
      adminUserId: this.adminUserId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      version: this.version,
    };
  }
}
