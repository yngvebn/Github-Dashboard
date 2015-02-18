using System.Web.Http;

namespace Api.Controllers
{
    public class ValuesController : ApiController
    {
        public IHttpActionResult GetValues()
        {
            return Ok(new[] { "a", "b", "c" });
        }
    }
}
