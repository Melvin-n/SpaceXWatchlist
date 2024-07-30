using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SpaceXLaunches.Data;
using SpaceXLaunches.Models;
using System.Threading.Tasks;

namespace SpaceXLaunches.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LaunchesController : ControllerBase
    {
        private readonly SpaceXLaunchesContext _context;

        public LaunchesController(SpaceXLaunchesContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetLaunches()
        {
            var launches = await _context.Launch.ToListAsync();
            return Ok(launches);
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddLaunch([FromBody] Launch newLaunch)
        {

            if (newLaunch == null)
            {
                return BadRequest("Launch data is required.");
            }

            var existingLaunch = await _context.Launch
            .AsNoTracking() 
            .SingleOrDefaultAsync(l => l.ID == newLaunch.ID);

            if (existingLaunch != null)
            {
                return BadRequest("Launch with this ID already exists.");
            }


            _context.Launch.Add(newLaunch);
            await _context.SaveChangesAsync();

            return Ok($"Launch \"{newLaunch.Name}\" successfully added launch to watchlist");
        }
    }
}
