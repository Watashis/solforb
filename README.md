# solforb

```c#
///не забудьте изменить строчку
builder.Services.AddDbContext<DataBase>(option => option.UseSqlServer("Data Source=localhost;Initial Catalog=solforb;Persist Security Info=True;User ID=sa;Password=yourStrong(!)Password;"));
```
И создать таблицы из файла [sql.sql](/sql.sql)
