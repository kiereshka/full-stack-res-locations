using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using kiereshka.Models;
using kiereshka.Services;

[ApiController]
[Route("api/[controller]")]
public class OptimizationController : ControllerBase
{
    private readonly OptimizationService _service;

    public OptimizationController(OptimizationService service)
    {
        _service = service;
    }

    [HttpPost]
    public async Task<IActionResult> Optimize([FromBody] OptimizationInput input)
    {
        if (input == null)
        {
            return BadRequest("Вхідні дані не можуть бути порожніми.");
        }

        if (input.M <= 0 || input.N <= 0 || input.D < 0 || input.C < 0)
        {
            return BadRequest("Параметри M, N, D і C повинні бути невід’ємними.");
        }

        if (input.Locations == null || input.Locations.Count != input.M)
        {
            return BadRequest($"Кількість локацій повинна дорівнювати {input.M}.");
        }

        foreach (var location in input.Locations)
        {
            if (location.Costs == null || location.Costs.Count != input.N ||
                location.Capacities == null || location.Capacities.Count != input.N)
            {
                return BadRequest($"Кількість витрат і потужностей для кожної локації повинна дорівнювати {input.N}.");
            }
        }

        try
        {
            var result = await _service.RunOptimization(input);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Помилка сервера: {ex.Message}");
        }
    }
}