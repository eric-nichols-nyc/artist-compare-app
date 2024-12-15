# artist-flow

You are an expert in React, Tailwind CSS1. Analyze the data flow and the components.

1. user enters the artist name in the search bar
2. the artist name is sets to the searchQuery state
3. user clicks second artist name
4. second artist name is set to the searchQuery state
5. user clicks change artist in first artist profile
6. first artist is removed from the searchQuery state
7. artist list is displayed
8. user clicks second artist change button
9. second artist is removed from the searchQuery state
10. artist list is displayed
if both artists are selected, the searchQuery state is sent to the backend
13. the backend returns the artist data
