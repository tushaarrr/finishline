"""
FinishLine Backend — Plaid Service
All Plaid API calls: link token, exchange, accounts, transactions.
"""
import plaid
from plaid.api import plaid_api
from plaid.model.link_token_create_request import LinkTokenCreateRequest
from plaid.model.link_token_create_request_user import LinkTokenCreateRequestUser
from plaid.model.item_public_token_exchange_request import ItemPublicTokenExchangeRequest
from plaid.model.transactions_get_request import TransactionsGetRequest
from plaid.model.accounts_get_request import AccountsGetRequest
from plaid.model.products import Products
from plaid.model.country_code import CountryCode
from plaid.configuration import Configuration
from plaid.api_client import ApiClient
from config import get_settings


def get_plaid_client() -> plaid_api.PlaidApi:
    """Initialize Plaid API client for Sandbox environment."""
    settings = get_settings()
    configuration = Configuration(
        host=plaid.Environment.Sandbox,
        api_key={
            "clientId": settings.plaid_client_id,
            "secret": settings.plaid_secret,
        }
    )
    api_client = ApiClient(configuration)
    return plaid_api.PlaidApi(api_client)


def create_link_token(user_id: str) -> str:
    """Create a Plaid Link token for the frontend to open the Plaid modal."""
    client = get_plaid_client()
    request = LinkTokenCreateRequest(
        products=[Products("transactions")],
        client_name="FinishLine",
        country_codes=[CountryCode("CA"), CountryCode("US")],
        language="en",
        user=LinkTokenCreateRequestUser(client_user_id=user_id),
    )
    response = client.link_token_create(request)
    return response.link_token


def exchange_public_token(public_token: str) -> dict:
    """Exchange the public token from Plaid Link for a permanent access token."""
    client = get_plaid_client()
    request = ItemPublicTokenExchangeRequest(public_token=public_token)
    response = client.item_public_token_exchange(request)
    return {
        "access_token": response.access_token,
        "item_id": response.item_id,
    }


def get_accounts(access_token: str) -> list:
    """Fetch all accounts from Plaid for a given access token."""
    client = get_plaid_client()
    request = AccountsGetRequest(access_token=access_token)
    response = client.accounts_get(request)
    return response.accounts


def get_transactions(access_token: str, start_date, end_date) -> list:
    """Fetch transactions from Plaid for a date range."""
    client = get_plaid_client()
    request = TransactionsGetRequest(
        access_token=access_token,
        start_date=start_date,
        end_date=end_date,
    )
    response = client.transactions_get(request)
    return response.transactions
