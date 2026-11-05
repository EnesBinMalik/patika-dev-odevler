/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Author: Enes Öztürk
 * Project: BookStore WebApi Unit Testing Suite (.NET Core)
 */

import JSZip from 'jszip';
import { TEST_FILES } from '../data/testFiles';

export async function generateProjectZip(): Promise<Blob> {
  const zip = new JSZip();

  // Root README with Homework Report & Enes Öztürk Signature
  const readmeContent = `# BookStore WebApi Unit Test Suite
**Geliştirici / Öğrenci:** Enes Öztürk  
**Ödev:** .NET Core WebApi - Unit Testing (Book, Genre & Author Servisleri)  
**Tarih:** 2026  
**Kullanılan Teknolojiler:** .NET Core, xUnit, FluentAssertions, FluentValidation, Moq, AutoMapper, EF Core InMemory  

---

## 1. Proje Özeti
Bu proje, BookStore WebApi projesinde yer alan tüm servislerin eksiksiz birim testlerini içermektedir:
1. **Book Servisleri Birim Testleri:**
   - DeleteBookCommand & DeleteBookCommandValidator
   - UpdateBookCommand & UpdateBookCommandValidator
   - GetBookDetailQuery & GetBookDetailQueryValidator
2. **Genre Servisleri Birim Testleri:**
   - CreateGenreCommand & CreateGenreCommandValidator
   - DeleteGenreCommand & DeleteGenreCommandValidator
   - UpdateGenreCommand & UpdateGenreCommandValidator
   - GetGenreDetailQuery & GetGenreDetailQueryValidator
3. **Author Servisleri Birim Testleri (Enes Öztürk İmzalı):**
   - CreateAuthorCommand & CreateAuthorCommandValidator
   - DeleteAuthorCommand & DeleteAuthorCommandValidator
   - UpdateAuthorCommand & UpdateAuthorCommandValidator
   - GetAuthorDetailQuery & GetAuthorDetailQueryValidator
4. **Test Altyapısı (TestSetup):**
   - CommonTestFixture (InMemory DB & AutoMapper Setup)
   - Başlangıç Seed Verileri (Books, Genres, Authors)

---

## 2. Testleri Çalıştırma
\`\`\`bash
cd BookStore.UnitTests
dotnet test
\`\`\`

Hazırlayan: **Enes Öztürk**
`;

  zip.file('README.md', readmeContent);

  // Solution and Project files
  const csprojContent = `<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <TargetFramework>net6.0</TargetFramework>
    <Nullable>enable</Nullable>
    <IsPackable>false</IsPackable>
    <!-- Geliştirici: Enes Öztürk -->
    <Authors>Enes Öztürk</Authors>
    <Company>Enes Öztürk Software</Company>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="AutoMapper" Version="12.0.1" />
    <PackageReference Include="FluentAssertions" Version="6.12.0" />
    <PackageReference Include="FluentValidation" Version="11.8.0" />
    <PackageReference Include="Microsoft.EntityFrameworkCore.InMemory" Version="6.0.25" />
    <PackageReference Include="Microsoft.NET.Test.Sdk" Version="17.8.0" />
    <PackageReference Include="Moq" Version="4.20.70" />
    <PackageReference Include="xunit" Version="2.6.2" />
    <PackageReference Include="xunit.runner.visualstudio" Version="2.5.4">
      <IncludeAssets>runtime; build; native; contentfiles; analyzers; buildtransitive</IncludeAssets>
      <PrivateAssets>all</PrivateAssets>
    </PackageReference>
  </ItemGroup>

</Project>`;

  zip.file('BookStore.UnitTests/BookStore.UnitTests.csproj', csprojContent);

  // Add each test file to its appropriate folder
  TEST_FILES.forEach((file) => {
    zip.file(`BookStore.UnitTests/${file.path}`, file.code);

    if (file.sourceCode) {
      const srcPath = file.path.replace('Tests.cs', '.cs').replace('Application/', 'BookStore.WebApi/Application/');
      zip.file(srcPath, `// Servis Kaynak Kodu - Referans\n${file.sourceCode}`);
    }

    if (file.validatorCode) {
      const valPath = file.path.replace('ValidatorTests.cs', 'Validator.cs').replace('Application/', 'BookStore.WebApi/Application/');
      zip.file(valPath, `// Doğrulayıcı Kaynak Kodu - Referans\n${file.validatorCode}`);
    }
  });

  return await zip.generateAsync({ type: 'blob' });
}

export function downloadFile(filename: string, content: string, mimeType = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
