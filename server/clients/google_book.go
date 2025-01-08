package clients

import (
	"fmt"
	"net/http"
	"net/url"

	"github.com/G-Villarinho/book-wise-api/config"
	"github.com/G-Villarinho/book-wise-api/internal"
	jsoniter "github.com/json-iterator/go"
)

type GoogleBooksResponse struct {
	Kind       string   `json:"kind"`
	TotalItems int      `json:"totalItems"`
	Items      []Volume `json:"items"`
}

type Volume struct {
	ID         string `json:"id"`
	VolumeInfo struct {
		Title         string   `json:"title"`
		Authors       []string `json:"authors"`
		Publisher     string   `json:"publisher"`
		PublishedDate string   `json:"publishedDate"`
		Description   string   `json:"description"`
		PageCount     int      `json:"pageCount"`
		Categories    []string `json:"categories"`
		Language      string   `json:"language"`
		ImageLinks    struct {
			SmallThumbnail string `json:"smallThumbnail"`
			Thumbnail      string `json:"thumbnail"`
		} `json:"imageLinks"`
	} `json:"volumeInfo"`
}

type GoogleBookClient interface {
	SearchBooks(query string, startIndex int) ([]Volume, error)
}

type googleBookClient struct {
	di *internal.Di
}

func NewGoogleBookClient(di *internal.Di) (GoogleBookClient, error) {
	return &googleBookClient{
		di: di,
	}, nil
}

func (g *googleBookClient) SearchBooks(query string, startIndex int) ([]Volume, error) {
	escapedQuery := url.QueryEscape(query)

	url := fmt.Sprintf("%s?q=%s&maxResults=5&startIndex=%d", config.Env.GoogleBooksApiUrl, escapedQuery, startIndex)

	var httpClient http.Client

	resp, err := httpClient.Get(url)
	if err != nil {
		return nil, fmt.Errorf("request google books api: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("consult api, status: %v", resp.StatusCode)
	}

	var result GoogleBooksResponse
	if err := jsoniter.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, fmt.Errorf("decoder google books api response: %v", err)
	}

	return result.Items, nil
}
