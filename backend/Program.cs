using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using kiereshka.Services;

var builder = WebApplication.CreateBuilder(args);

// Додавання сервісів
builder.Services.AddControllers();
builder.Services.AddScoped<OptimizationService>();

var app = builder.Build();

// Налаштування конвеєра
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

// Налаштування порту
app.Urls.Add("http://localhost:5000");

app.Run();