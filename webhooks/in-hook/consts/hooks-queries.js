export default {
  TEST_CREATE_COMPANY_WITH_CONTACT: {
    description: {
      title: `Создать тестовую компанию с контактом`,
      query: ``,
    },
    query: ``,
    form: `<form class="form-hook-submit hook-item-content" name="test-create-company-with-contact">
            <input type="submit" value="Создать" />
          </form>`,
    status: true,
  },

  CRM_COMPANY_LIST: {
    description: {
      title: `Получить список компаний (по полям)`,
      query: `crm.company.list`,
    },
    query: `crm.company.list.json`,
    form: `<form class="form-hook-submit hook-item-content" name="crm-company-list">
            <div class="input-block">
              <span class="label">ORIGIN_ID:</span>
              <input type="number" name="ORIGIN_ID" />
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
              <input type="text" name="TITLE" />
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

  CRM_COMPANY_GET: {
    description: {
      title: `Получить данные по компании`,
      query: `crm.company.get`,
    },
    form: `<form class="form-hook-submit hook-item-content" name="crm-company-get">
            <div class="input-block">
              <span class="label">Введите ID компании:</span>
              <input type="number" name="companyId" />
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
              <input type="number" name="companyId" />
            </div>
            <input type="submit" value="Удалить" />
          </form>`,
    query: `crm.company.delete.json`,
    status: true,
  },
  
  CRM_COMPANY_CONTACT_FIELDS: {
    description: {
      title: `Получить набор полей контакта`,
      query: `crm.company.contact.fields`,
    },
    form: `<form class="form-hook-submit hook-item-content" name="crm-company-contac-fields">
            <input type="submit" value="Запросить" />
          </form>`,
    query: `crm.company.contact.fields.json`,
    status: true,
  },

  CRM_CONTACT_ADD: {
    description: {
      title: `Создать новый контакт`,
      query: `crm.contact.add`,
    },
    query: `crm.contact.add.json`,
    status: false,
  },


};