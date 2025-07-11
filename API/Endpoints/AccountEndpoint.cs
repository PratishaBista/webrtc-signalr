using System;
using API.Common;
using API.Models;
using API.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Endpoints;

public static class AccountEndpoint
{
    public static RouteGroupBuilder MapAccountEndpoint(this WebApplication app)
    {
        var group = app.MapGroup("/api/account").WithTags("account");

        group.MapPost("/register", async (HttpContext context, UserManager<AppUser>
        userManager, [FromForm] string fullname, [FromForm] string email,
        [FromForm] string password, [FromForm] string username, [FromForm] IFormFile? profileImage) =>

        //IFormFile is nullable to allow registration without a profile image
        {
            var userFromDb = await userManager.FindByEmailAsync(email);
            if (userFromDb is not null)
            {
                return Results.BadRequest(Response<string>.Failure("User already exists"));
            }

            // Validate the profile image if provided
            if (profileImage is null)
            {
                return Results.BadRequest(Response<string>.Failure("Profile image is required"));
            }

            var picture = await FileUpload.Upload(profileImage);

            picture = $"{context.Request.Scheme}://{context.Request.Host}/uploads/{picture}";

            var user = new AppUser
            {
                Email = email,
                FullName = fullname,
                UserName = username,
                ProfileImage = picture
            };

            var result = await userManager.CreateAsync(user, password);

            if (!result.Succeeded)
            {
                return Results.BadRequest(Response<string>.Failure(result.Errors.Select(x => x.Description).FirstOrDefault()!));
            }

            return Results.Ok(Response<string>.Success("", "User created successfully."));
        }).DisableAntiforgery();

        return group;
    }
}
