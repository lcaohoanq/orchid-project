package com.orchid.orchidbe.domain.account;

import java.util.List;

public interface AccountService {

    List<AccountDTO.AccountResp> getAll();

    Account getById(String id);

    Account getByEmail(String email);

    void addEmployee(AccountDTO.CreateStaffReq account);
    void add(AccountDTO.CreateAccountReq account);

    void update(String id, AccountDTO.UpdateAccountReq account);

    void delete(String id);

    String login(String email, String password) throws Exception;

}
