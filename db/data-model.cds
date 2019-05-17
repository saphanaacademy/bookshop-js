namespace my.bookshop;

entity Books {
  key ID : UUID;
  title  : String;
  stock  : Integer;
  tenantID : UUID;
}
