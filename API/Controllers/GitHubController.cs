using System;
using System.IO;
using System.Net;
using System.Runtime.CompilerServices;
using System.Runtime.Serialization.Json;
using System.Web;
using System.Web.Http;
using RestSharp;

namespace Api.Controllers
{
    [RoutePrefix("api")]
    public class GitHubController : ApiController
    {
        [Route("github/accesstoken"), HttpPost]
        public IHttpActionResult AccessToken(AccessTokenRequest accessTokenRequest)
        {
            var client = new RestClient("https://github.com/");
            client.UserAgent = "Github-Dashboard";
            var request = new RestRequest("/login/oauth/access_token", Method.POST);
            request.AddObject(accessTokenRequest);
            request.RequestFormat = DataFormat.Json;
            
            var response = client.Execute(request);

            return Ok(Newtonsoft.Json.JsonConvert.DeserializeObject<dynamic>(response.Content));
        }

    }

    public class AccessTokenRequest
    {
        public string client_id { get; set; }
        public string client_secret { get; set; }
        public string code { get; set; }
    }

}
