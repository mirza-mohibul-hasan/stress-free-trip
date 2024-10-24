import os
from datetime import datetime

# Example data for the trip
trip_data = {
    "user_name": "Asif",
    "trip_destination": "Saint Martin",
    "trip_start_date": "2024-12-01",
    "trip_end_date": "2024-12-07",
    "transport": "Bus from Dhaka to Cox's Bazar, then a boat to Saint Martin",
    "accommodation": "Saint Martin Resort - Mid-range, with a beautiful view of the ocean",
    "meals": [
        {"day": 1, "meal": "Local seafood dinner at Coral View Restaurant"},
        {"day": 3, "meal": "Beachside BBQ at Saint Martin Beach"},
        {"day": 5, "meal": "Lunch at Island Cafe, specializing in tropical fruits and seafood"}
    ],
    "activities": [
        {"day": 1, "activity": "Arrival in Saint Martin, beach walk, and sunset viewing."},
        {"day": 2, "activity": "Snorkeling in the coral reefs and a tour of the island."},
        {"day": 3, "activity": "Boat ride around the island and BBQ dinner."},
        {"day": 4, "activity": "Relaxation at the resort and island hike."},
        {"day": 5, "activity": "Trip to Chera Dwip, a small island off Saint Martin."},
        {"day": 6, "activity": "Free day to explore or relax."},
        {"day": 7, "activity": "Departure from Saint Martin back to Dhaka."}
    ],
    "notable_events": [
        {"event": "Unexpected rainstorm on Day 4 during the island hike."},
        {"event": "Spotted dolphins during the boat ride on Day 3."},
        {"event": "A local festival on Day 6 with music and dancing."}
    ]
}

def format_date(date_str):
    """Helper function to format dates."""
    return datetime.strptime(date_str, "%Y-%m-%d").strftime("%B %d, %Y")

def generate_blog(trip_data):
    """Generates a markdown-formatted travel blog using trip data."""
    # Blog title and introduction
    blog_content = f"# {trip_data['user_name']}'s Trip to {trip_data['trip_destination']}\n\n"
    blog_content += f"**Trip Dates**: {format_date(trip_data['trip_start_date'])} to {format_date(trip_data['trip_end_date'])}\n\n"
    blog_content += f"After finishing the semester, {trip_data['user_name']} decided to take a relaxing trip to {trip_data['trip_destination']}. "
    blog_content += f"Here's a memorable recap of the journey!\n\n"

    # Transport and Accommodation
    blog_content += f"## Travel and Stay\n\n"
    blog_content += f"- **Transport**: {trip_data['transport']}\n"
    blog_content += f"- **Accommodation**: {trip_data['accommodation']}\n\n"

    # Day-by-day activities
    blog_content += "## Daily Highlights\n\n"
    for activity in trip_data['activities']:
        blog_content += f"**Day {activity['day']}**: {activity['activity']}\n"

    blog_content += "\n"

    # Meals
    blog_content += "## Memorable Meals\n\n"
    for meal in trip_data['meals']:
        blog_content += f"**Day {meal['day']}**: {meal['meal']}\n"

    blog_content += "\n"

    # Notable Events
    blog_content += "## Notable Events\n\n"
    for event in trip_data['notable_events']:
        blog_content += f"- {event['event']}\n"

    blog_content += "\n## Conclusion\n\n"
    blog_content += "The trip to Saint Martin was a memorable one, full of beautiful scenery, exciting adventures, and some unexpected surprises. "
    blog_content += "From exploring coral reefs to enjoying local festivals, this trip was a perfect way to relax after exams.\n"

    return blog_content

def save_blog(blog_content, filename="trip_blog.md"):
    """Saves the generated blog to a markdown file."""
    with open(filename, "w") as file:
        file.write(blog_content)
    print(f"Blog saved as {filename}")

# Generate the blog content
blog_content = generate_blog(trip_data)

# Save the blog to a file
save_blog(blog_content)

# Print preview
print(blog_content)
