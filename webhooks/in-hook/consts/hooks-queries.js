export default {
  TEST_CREATE_CONTACT_WITH_PHONE: {
    description: {
      title: `Создать тестовый контакт с номером телефона`,
      query: `test-create-contact-with-phone`,
    },
    query: ``,
    form: `<form class="form-hook-submit hook-item-content" name="test-create-contact-with-phone">
            <input type="submit" value="Создать" />
          </form>`,
    status: true,
  },
  
  TEST_CREATE_COMPANY_WITH_CONTACT: {
    description: {
      title: `Создать тестовую компанию с контактом`,
      query: `test-create-company-with-contact`,
    },
    query: ``,
    form: `<form class="form-hook-submit hook-item-content" name="test-create-company-with-contact">
            <input type="submit" value="Создать" />
          </form>`,
    status: true,
  },

  CREATE_AND_UPDATE_COMPANIES_WITH_CONTACTS: {
    description: {
      title: `Создать новые и обновить существующие в BX24`,
      query: `create-and-update-companies-with-contacts`,
    },
    query: ``,
    form: `<form class="form-hook-submit hook-item-content" name="create-and-update-companies-with-contacts">
            <input class="button file-upload" type="file" accept=".json" />
            <input type="submit" class="file-upload-submit" disabled value="Создать" />
          </form>`,
    status: true,
  },
  

  CRM_COMPANY_FIELD: {
    description: {
      title: `Получить список полей для компании`,
      query: `crm.company.fields`,
    },
    query: `crm.company.list.json`,
    form: `<form class="form-hook-submit hook-item-content" name="crm-company-fields">
            <input type="submit" value="Получить" />
          </form>`,
    status: true,
  },

  CRM_COMPANY_LIST: {
    description: {
      title: `Получить список компаний (по ORIGIN_ID)`,
      query: `crm.company.list`,
    },
    query: `crm.company.list.json`,
    form: `<form class="form-hook-submit hook-item-content" name="crm-company-list-by-origin-id">
            <div class="input-block">
              <span class="label">ORIGIN_ID:</span>
              <input type="number" name="ORIGIN_ID" required/>
            </div>
            <input type="submit" value="Получить" />
          </form>`,
    status: true,
  },

  CRM_COMPANY_ADD: {
    description: {
      title: `Создать компанию`,
      query: `crm.company.add`,
    },
    query: `crm.company.add.json`,
    form: `<form class="form-hook-submit hook-item-content" name="crm-company-add">
            <div class="input-block">
              <span class="label">Название компании:</span>
              <input type="text" name="TITLE" required />
            </div>
            <div class="input-block">
              <span class="label">ORIGIN_ID:</span>
              <input type="number" name="ORIGIN_ID" />
            </div>
            <div class="input-block">
              <span class="label">CREATED_BY_ID:</span>
              <input type="number" name="CREATED_BY_ID" />
            </div>
            <div class="input-block">
              <span class="label">ASSIGNED_BY_ID:</span>
              <input type="number" name="ASSIGNED_BY_ID" />
            </div>
            <input type="submit" value="Создать" />
          </form>`,
    status: true,
  },

  CRM_COMPANY_UPDATE: {
    description: {
      title: `Обновить компанию`,
      query: `crm.company.update`,
    },
    query: `crm.company.update.json`,
    form: `<form class="form-hook-submit hook-item-content" name="crm-company-update">
            <div class="input-block">
              <span class="label">ID:</span>
              <input type="number" name="ID" required />
            </div>
            <div class="input-block">
              <span class="label">Название компании:</span>
              <input type="text" name="TITLE" />
            </div>
            <div class="input-block">
              <span class="label">Адрес:</span>
              <input type="text" name="ADDRESS" />
            </div>
            <div class="input-block">
              <span class="label">Телефон:</span>
              <input type="tel" name="PHONE" />
            </div>
            <div class="input-block">
              <span class="label">Комментарий:</span>
              <input type="text" name="COMMENTS" />
            </div>
            <div class="input-block">
              <span class="label">CREATED_BY_ID:</span>
              <input type="number" name="CREATED_BY_ID" />
            </div>
            <div class="input-block">
              <span class="label">ASSIGNED_BY_ID:</span>
              <input type="number" name="ASSIGNED_BY_ID" />
            </div>
            <input type="submit" value="Создать" />
          </form>`,
    status: true,
  },

  CRM_COMPANY_GET: {
    description: {
      title: `Получить данные по компании`,
      query: `crm.company.get`,
    },
    form: `<form class="form-hook-submit hook-item-content" name="crm-company-get">
            <div class="input-block">
              <span class="label">Введите ID компании:</span>
              <input type="number" name="companyId" required/>
            </div>
            <input type="submit" value="Получить" />
          </form>`,
    query: `crm.company.get.json`,
    status: true, // Можно ли запускать или ещё не работает
  },

  CRM_COMPANY_DELETE: {
    description: {
      title: `Удалить компанию`,
      query: `crm.company.delete`,
    },
    form: `<form class="form-hook-submit hook-item-content" name="crm-company-delete">
            <div class="input-block">
              <span class="label">Введите ID компании:</span>
              <input type="number" name="companyId" required />
            </div>
            <input type="submit" value="Удалить" />
          </form>`,
    query: `crm.company.delete.json`,
    status: true,
  },
  // crm.multifield.fields
  CRM_MULTIFIELD_FIELDS: {
    description: {
      title: `Получить набор полей multifield`,
      query: `crm.multifield.fields`,
    },
    form: `<form class="form-hook-submit hook-item-content" name="crm-multifield-fields">
            <input type="submit" value="Запросить" />
          </form>`,
    query: `crm.multifield.fields.json`,
    status: true,
  },

  CRM_COMPANY_CONTACT_FIELDS: {
    description: {
      title: `Получить набор полей контакта`,
      query: `crm.company.contact.fields`,
    },
    form: `<form class="form-hook-submit hook-item-content" name="crm-company-contact-fields">
            <input type="submit" value="Запросить" />
          </form>`,
    query: `crm.company.contact.fields.json`,
    status: true,
  },

  CRM_COMPANY_CONTACT_ADD: {
    description: {
      title: `Связать контакт с компанией`,
      query: `crm.company.contact.add`,
    },
    query: `crm.company.contact.add.json`,
    form: `<form class="form-hook-submit hook-item-content" name="crm-company-contact-add">
            <div class="input-block">
              <span class="label">ID компании:</span>
              <input type="number" name="companyId" required />
            </div>
            <div class="input-block">
              <span class="label">ID контакта:</span>
              <input type="number" name="contactId" required />
            </div>
            
            <input type="submit" value="Создать" />
          </form>`,
    status: true,
  },

  CRM_CONTACT_FIELDS: {
    description: {
      title: `Получить набор полей контакта`,
      query: `crm.contact.fields`,
    },
    form: `<form class="form-hook-submit hook-item-content" name="crm-contact-fields">
            <input type="submit" value="Запросить" />
          </form>`,
    query: `crm.contact.fields.json`,
    status: true,
  },

  CRM_CONTACT_GET: {
    description: {
      title: `Получить данные по контакту`,
      query: `crm.contact.get`,
    },
    form: `<form class="form-hook-submit hook-item-content" name="crm-contact-get">
            <div class="input-block">
              <span class="label">Введите ID контакта:</span>
              <input type="number" name="contactId" required />
            </div>
            <input type="submit" value="Получить" />
          </form>`,
    query: `crm.contact.get.json`,
    status: true, 
  },

  CRM_CONTACT_ADD: {
    description: {
      title: `Создать новый контакт`,
      query: `crm.contact.add`,
    },
    query: `crm.contact.add.json`,
    form: `<form class="form-hook-submit hook-item-content" name="crm-contact-add">
            <div class="input-block">
              <span class="label">Фамилия:</span>
              <input type="text" name="LAST_NAME" />
            </div>
            <div class="input-block">
              <span class="label">Имя:</span>
              <input type="text" name="NAME" required />
            </div>
            <div class="input-block">
              <span class="label">Отчество:</span>
              <input type="text" name="SECOND_NAME" />
            </div>
            <div class="input-block">
              <span class="label">Телефон:</span>
              <input type="number" name="PHONE" />
            </div>
            <div class="input-block">
              <span class="label">Адрес:</span>
              <input type="text" name="ADDRESS" />
            </div>
            <div class="input-block">
              <span class="label">CREATED_BY_ID:</span>
              <input type="number" name="CREATED_BY_ID" />
            </div>
            <div class="input-block">
              <span class="label">ASSIGNED_BY_ID:</span>
              <input type="number" name="ASSIGNED_BY_ID" />
            </div>
            <input type="submit" value="Создать" />
          </form>`,
    status: true,
  },

  CRM_CONTACT_DELETE: {
    description: {
      title: `Удалить контакт`,
      query: `crm.contact.delete`,
    },
    form: `<form class="form-hook-submit hook-item-content" name="crm-contact-delete">
            <div class="input-block">
              <span class="label">Введите ID контакта:</span>
              <input type="number" name="contactId" required />
            </div>
            <input type="submit" value="Удалить" />
          </form>`,
    query: `crm.contact.delete.json`,
    status: true,
  },
};